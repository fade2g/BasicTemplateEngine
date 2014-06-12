"use strict";
/**
 * Created by holger on 12.06.2014.
 */
/* namespace ki, see book "JavaScrip Patterns, p. 89f */
var ki = ki || {};
ki.namespace = function (ns_string) {
    var parts = ns_string.split('.'),
        parent = ki,
        i;
// strip redundant leading global
    if (parts[0] === "ki") {
        parts = parts.slice(1);
    }
    for (i = 0; i < parts.length; i += 1) {
// create a property if it doesn't exist
        if (typeof parent[parts[i]] === "undefined") {
            parent[parts[i]] = {};
        }
        parent = parent[parts[i]];
    }
    return parent;
};