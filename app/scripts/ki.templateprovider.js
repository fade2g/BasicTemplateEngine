"use strict";
/**
 * Created by holger on 12.06.2014.
 */
ki.namespace('ki.templateprovider');

/**
 * The template provider module provides templates (strings)
 */
ki.templateprovider = (function() {

    var templates = {},
        TEMPLATE_PARSE_TAG = 'script',
        TEMPLATE_PARSE_TYPE = 'kickin/template';

    /**
     * This function registers a given template
     * @param templateName {string} Name of the template (i.e. the key)
     * @param template {string} Content of the template (a string that should evaluate to an HTML node sooner or later
     * @private
     */
    function _registerTemplate(templateName, template) {
        if(templateName && templateName !=="") {
            ki.helper.logInfo('Register template with name ' + templateName);
            templates[templateName] = template;
        } else {
            ki.helper.logWarn('No template name provided');
        }
    }

    function _unregisterTemplate(templateName) {
        if (templateName && templateName !== '') {
            ki.helper.logInfo('Unregister template with name ' + templateName);
            if(templates[templateName]) {
                delete templates[templateName];
            } else {
                ki.helper.logInfo('Template ' + templateName + ' was not registered at all');
            }
        }
    }

    function _getTemplate(templateName) {
        if (templateName && templateName !== '') {
            if(templates[templateName]) {
                return templates[templateName];
            } else {
                ki.helper.logWarn('Unknown template ' + templateName);
            }
        } else {
            ki.help.logWarn('Required template name is missing');
        }
    }

    /**
     * This function initializes the known templates.
     * This is done by registering this function to the document.ready event and pars the HTML for
     * special script tags in the HTML
     * At some time in the future, initialize can maybe download the templates from a library.
     * @private
     */
    function _init() {
        var scripts,
            script,
            attribute,
            i;
        scripts = document.getElementsByTagName(TEMPLATE_PARSE_TAG);
        i = scripts.length;
        while (i > 0) {
            script = scripts[i];
            if (script !== undefined) {
                attribute = script.getAttribute('type');
                if (attribute && attribute.valueOf() === TEMPLATE_PARSE_TYPE) {
                    // finally, if found the script tag for a template,
                    // now strap it from the script tag and store it in the
                    ki.helper.logInfo('Logging template...');
                    ki.helper.logDir(script);
                    // templates are properties of the template object
                    _registerTemplate(script.id, script.innerHTML);
                }
            }
            i--;
        }
    }

    // Parse the html document for the templates
    // same as $(document).ready in jQuery
    document.addEventListener("DOMContentLoaded", function() {
        ki.helper.logDebug('Initializing templates')
        _init();
    });

    return {
        /**
         * This method returns the template for the given name
         * @param templatename {String} name of the template
         */
        getTemplate: function(templateName) {
            return _getTemplate(templateName);
        },
        registerTemplate: function(templateName, template) {
            _registerTemplate(templateName, template);
        },
        unregisterTemplate: function(templateName) {
            _unregisterTemplate(templateName);
        },
        init: function() {
            _init();
        }
    };
})();

