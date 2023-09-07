// To parse this data:
//
//   import { Convert, CalendarEvent } from "./file";
//
//   const calendarEvent = Convert.toCalendarEvent(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.

export interface CalendarEvent {
    attendees:          Attendee[];
    conferenceData?:    ConferenceData;
    created?:           string;
    creator:            Creator;
    end:                End;
    etag?:              string;
    eventType?:         string;
    hangoutLink?:       string;
    htmlLink?:          string;
    iCalUID?:           string;
    id:                 string;
    kind?:              string;
    location?:          string;
    organizer:          Organizer;
    originalStartTime?: OriginalStartTime;
    recurringEventId?:  string;
    reminders?:         Reminders;
    sequence?:          number;
    start:              Start;
    status:             string;
    summary:            string;
    updated?:           string;
    [property: string]: any;
}

export interface Attendee {
    displayName?:    string;
    email:           string;
    organizer?:      boolean;
    resource?:       boolean;
    responseStatus?: string;
    self?:           boolean;
    [property: string]: any;
}

export interface ConferenceData {
    conferenceId?:       string;
    conferenceSolution?: ConferenceSolution;
    entryPoints?:        EntryPoint[];
    [property: string]: any;
}

export interface ConferenceSolution {
    iconUri?: string;
    key?:     Key;
    name?:    string;
    [property: string]: any;
}

export interface Key {
    type?: string;
    [property: string]: any;
}

export interface EntryPoint {
    entryPointType?: string;
    label?:          string;
    pin?:            string;
    regionCode?:     string;
    uri?:            string;
    [property: string]: any;
}

export interface Creator {
    email: string;
    [property: string]: any;
}

export interface End {
    dateTime: string;
    timeZone: string;
    [property: string]: any;
}

export interface Organizer {
    email: string;
    [property: string]: any;
}

export interface OriginalStartTime {
    dateTime: string;
    timeZone: string;
    [property: string]: any;
}

export interface Reminders {
    useDefault: boolean;
    [property: string]: any;
}

export interface Start {
    dateTime: string;
    timeZone: string;
    [property: string]: any;
}

// Converts JSON strings to/from your types
// and asserts the results of JSON.parse at runtime
export class Convert {
    public static toCalendarEvent(json: string): CalendarEvent {
        return cast(JSON.parse(json), r("CalendarEvent"));
    }

    public static calendarEventToJson(value: CalendarEvent): string {
        return JSON.stringify(uncast(value, r("CalendarEvent")), null, 2);
    }
}

function invalidValue(typ: any, val: any, key: any, parent: any = ''): never {
    const prettyTyp = prettyTypeName(typ);
    const parentText = parent ? ` on ${parent}` : '';
    const keyText = key ? ` for key "${key}"` : '';
    throw Error(`Invalid value${keyText}${parentText}. Expected ${prettyTyp} but got ${JSON.stringify(val)}`);
}

function prettyTypeName(typ: any): string {
    if (Array.isArray(typ)) {
        if (typ.length === 2 && typ[0] === undefined) {
            return `an optional ${prettyTypeName(typ[1])}`;
        } else {
            return `one of [${typ.map(a => { return prettyTypeName(a); }).join(", ")}]`;
        }
    } else if (typeof typ === "object" && typ.literal !== undefined) {
        return typ.literal;
    } else {
        return typeof typ;
    }
}

function jsonToJSProps(typ: any): any {
    if (typ.jsonToJS === undefined) {
        const map: any = {};
        typ.props.forEach((p: any) => map[p.json] = { key: p.js, typ: p.typ });
        typ.jsonToJS = map;
    }
    return typ.jsonToJS;
}

function jsToJSONProps(typ: any): any {
    if (typ.jsToJSON === undefined) {
        const map: any = {};
        typ.props.forEach((p: any) => map[p.js] = { key: p.json, typ: p.typ });
        typ.jsToJSON = map;
    }
    return typ.jsToJSON;
}

function transform(val: any, typ: any, getProps: any, key: any = '', parent: any = ''): any {
    function transformPrimitive(typ: string, val: any): any {
        if (typeof typ === typeof val) return val;
        return invalidValue(typ, val, key, parent);
    }

    function transformUnion(typs: any[], val: any): any {
        // val must validate against one typ in typs
        const l = typs.length;
        for (let i = 0; i < l; i++) {
            const typ = typs[i];
            try {
                return transform(val, typ, getProps);
            } catch (_) {}
        }
        return invalidValue(typs, val, key, parent);
    }

    function transformEnum(cases: string[], val: any): any {
        if (cases.indexOf(val) !== -1) return val;
        return invalidValue(cases.map(a => { return l(a); }), val, key, parent);
    }

    function transformArray(typ: any, val: any): any {
        // val must be an array with no invalid elements
        if (!Array.isArray(val)) return invalidValue(l("array"), val, key, parent);
        return val.map(el => transform(el, typ, getProps));
    }

    function transformDate(val: any): any {
        if (val === null) {
            return null;
        }
        const d = new Date(val);
        if (isNaN(d.valueOf())) {
            return invalidValue(l("Date"), val, key, parent);
        }
        return d;
    }

    function transformObject(props: { [k: string]: any }, additional: any, val: any): any {
        if (val === null || typeof val !== "object" || Array.isArray(val)) {
            return invalidValue(l(ref || "object"), val, key, parent);
        }
        const result: any = {};
        Object.getOwnPropertyNames(props).forEach(key => {
            const prop = props[key];
            const v = Object.prototype.hasOwnProperty.call(val, key) ? val[key] : undefined;
            result[prop.key] = transform(v, prop.typ, getProps, key, ref);
        });
        Object.getOwnPropertyNames(val).forEach(key => {
            if (!Object.prototype.hasOwnProperty.call(props, key)) {
                result[key] = transform(val[key], additional, getProps, key, ref);
            }
        });
        return result;
    }

    if (typ === "any") return val;
    if (typ === null) {
        if (val === null) return val;
        return invalidValue(typ, val, key, parent);
    }
    if (typ === false) return invalidValue(typ, val, key, parent);
    let ref: any = undefined;
    while (typeof typ === "object" && typ.ref !== undefined) {
        ref = typ.ref;
        typ = typeMap[typ.ref];
    }
    if (Array.isArray(typ)) return transformEnum(typ, val);
    if (typeof typ === "object") {
        return typ.hasOwnProperty("unionMembers") ? transformUnion(typ.unionMembers, val)
            : typ.hasOwnProperty("arrayItems")    ? transformArray(typ.arrayItems, val)
            : typ.hasOwnProperty("props")         ? transformObject(getProps(typ), typ.additional, val)
            : invalidValue(typ, val, key, parent);
    }
    // Numbers can be parsed by Date but shouldn't be.
    if (typ === Date && typeof val !== "number") return transformDate(val);
    return transformPrimitive(typ, val);
}

function cast<T>(val: any, typ: any): T {
    return transform(val, typ, jsonToJSProps);
}

function uncast<T>(val: T, typ: any): any {
    return transform(val, typ, jsToJSONProps);
}

function l(typ: any) {
    return { literal: typ };
}

function a(typ: any) {
    return { arrayItems: typ };
}

function u(...typs: any[]) {
    return { unionMembers: typs };
}

function o(props: any[], additional: any) {
    return { props, additional };
}

function m(additional: any) {
    return { props: [], additional };
}

function r(name: string) {
    return { ref: name };
}

const typeMap: any = {
    "CalendarEvent": o([
        { json: "attendees", js: "attendees", typ: a(r("Attendee")) },
        { json: "conferenceData", js: "conferenceData", typ: u(undefined, r("ConferenceData")) },
        { json: "created", js: "created", typ: u(undefined, "") },
        { json: "creator", js: "creator", typ: r("Creator") },
        { json: "end", js: "end", typ: r("End") },
        { json: "etag", js: "etag", typ: u(undefined, "") },
        { json: "eventType", js: "eventType", typ: u(undefined, "") },
        { json: "hangoutLink", js: "hangoutLink", typ: u(undefined, "") },
        { json: "htmlLink", js: "htmlLink", typ: u(undefined, "") },
        { json: "iCalUID", js: "iCalUID", typ: u(undefined, "") },
        { json: "id", js: "id", typ: "" },
        { json: "kind", js: "kind", typ: u(undefined, "") },
        { json: "location", js: "location", typ: u(undefined, "") },
        { json: "organizer", js: "organizer", typ: r("Organizer") },
        { json: "originalStartTime", js: "originalStartTime", typ: u(undefined, r("OriginalStartTime")) },
        { json: "recurringEventId", js: "recurringEventId", typ: u(undefined, "") },
        { json: "reminders", js: "reminders", typ: u(undefined, r("Reminders")) },
        { json: "sequence", js: "sequence", typ: u(undefined, 3.14) },
        { json: "start", js: "start", typ: r("Start") },
        { json: "status", js: "status", typ: "" },
        { json: "summary", js: "summary", typ: "" },
        { json: "updated", js: "updated", typ: u(undefined, "") },
    ], "any"),
    "Attendee": o([
        { json: "displayName", js: "displayName", typ: u(undefined, "") },
        { json: "email", js: "email", typ: "" },
        { json: "organizer", js: "organizer", typ: u(undefined, true) },
        { json: "resource", js: "resource", typ: u(undefined, true) },
        { json: "responseStatus", js: "responseStatus", typ: u(undefined, "") },
        { json: "self", js: "self", typ: u(undefined, true) },
    ], "any"),
    "ConferenceData": o([
        { json: "conferenceId", js: "conferenceId", typ: u(undefined, "") },
        { json: "conferenceSolution", js: "conferenceSolution", typ: u(undefined, r("ConferenceSolution")) },
        { json: "entryPoints", js: "entryPoints", typ: u(undefined, a(r("EntryPoint"))) },
    ], "any"),
    "ConferenceSolution": o([
        { json: "iconUri", js: "iconUri", typ: u(undefined, "") },
        { json: "key", js: "key", typ: u(undefined, r("Key")) },
        { json: "name", js: "name", typ: u(undefined, "") },
    ], "any"),
    "Key": o([
        { json: "type", js: "type", typ: u(undefined, "") },
    ], "any"),
    "EntryPoint": o([
        { json: "entryPointType", js: "entryPointType", typ: u(undefined, "") },
        { json: "label", js: "label", typ: u(undefined, "") },
        { json: "pin", js: "pin", typ: u(undefined, "") },
        { json: "regionCode", js: "regionCode", typ: u(undefined, "") },
        { json: "uri", js: "uri", typ: u(undefined, "") },
    ], "any"),
    "Creator": o([
        { json: "email", js: "email", typ: "" },
    ], "any"),
    "End": o([
        { json: "dateTime", js: "dateTime", typ: "" },
        { json: "timeZone", js: "timeZone", typ: "" },
    ], "any"),
    "Organizer": o([
        { json: "email", js: "email", typ: "" },
    ], "any"),
    "OriginalStartTime": o([
        { json: "dateTime", js: "dateTime", typ: "" },
        { json: "timeZone", js: "timeZone", typ: "" },
    ], "any"),
    "Reminders": o([
        { json: "useDefault", js: "useDefault", typ: true },
    ], "any"),
    "Start": o([
        { json: "dateTime", js: "dateTime", typ: "" },
        { json: "timeZone", js: "timeZone", typ: "" },
    ], "any"),
};
