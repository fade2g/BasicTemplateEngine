"use strict";
/**
 * Created by holger on 12.06.2014.
 */
ki.namespace('ki.entities');

/**
 * The entities module provides constructors for model entities
 */
ki.entities = (function() {
    var constructors = {
        Article: function Article(id, title, url, description, votes) {
            this.id = id;
            this.title = title;
            this.url = url;
            this.description = description;
            this.votes = votes;
        }
    };

    /**
     * Constructor for Observable object, that is backed by a bean
     */
    var Observable = function(observedBean){
        this.subscribers = [];
        this.observedBean = observedBean;
    };

    /**
     *
     * @type {{subscribe: subscribe, unsubscribe: unsubscribe, publish: publish, setBeanProperty: setBeanProperty, getBean: getBean}}
     */
    Observable.prototype = {
        /**
         * This method allows subscribing to changes of the bean.
         * @param callback {function} Callback function to be executed
         */
        subscribe: function subscribe(callback) {
            if (!_.contains(this.subscribers, callback)) {
                this.subscribers.push(callback);
            }
        },
        /**
         * This method allows unsubscribing from changes of the observed bean
         * @param callback
         */
        unsubscribe: function unsubscribe(callback) {
            this.subscribers = _.without(this.subscribers, callback);
        },
        publish: function(data) {
            _.each(this.subscribers, function(element, index, list) {
                element(data);
            });
        },
        /**
         * This method sets a new value on the bean of the observable. If there is a setter function for the
         * property (i.e. setPropertyName), the setter function will be called.
         * If the propertyName is a function, the function will be called.
         * if the property is but a property, the property will be set.
         * The old value and the new value differ, the change will be published (well, that's what it's all about)
         * @param propertyName {String} Name of the property to be set
         * @param newPropertyValue {*} Value to be set
         */
        setBeanProperty: function setBeanProperty(propertyName, newPropertyValue) {
            var data = {},
                setterFunction = 'set' + propertyName.charAt(0).toUpperCase() + propertyName.slice(1),
                getterFunction = 'get' + propertyName.charAt(0).toUpperCase() + propertyName.slice(1),
                observedFunctions = _.functions(this.observedBean),
                getOldValue = function getOldBeanValue(propertyName) {
                    if(_.contains(observedFunctions, getterFunction)) {
                        return this[getterFunction]();
                    } else if (_.contains(observedFunctions, propertyName)) {
                        return this[propertyName]()
                    } else {
                        return this[propertyName];
                    }
                },
                setNewValue = function setNewBeanValue(propertyName, propertyValue) {
                    if(_.contains(observedFunctions, setterFunction)) {
                        this[setterFunction](propertyValue);
                        data.propertyChanged = setterFunction;
                        ki.helper.logDebug('Calling setter function ' + setterFunction + ' on observedBean with argument ' + propertyValue )
                    } else if (_.contains(observedFunctions, propertyName)) {
                        this[propertyName](propertyValue);
                        ki.helper.logDebug('Calling setter function ' + propertyName + ' on observedBean with argument ' + propertyValue );
                        data.propertyChanged = setterFunction;
                    } else {
                        this[propertyName] = propertyValue;
                        ki.helper.logDebug('Setting bean property ' + propertyName + ' on observedBean with argument ' + propertyValue );
                    }
                };

            /* first check, if propertyName is function or if there is a setter-function with the scheme setPropertyName
             * if this is the case, call the function. Otherwise check, if the propertyName exists and update it
             * if the property name is missing, add the property to the bean with the given value
             */
            data.oldValue = getOldValue.apply(this.observedBean, [propertyName]);
            if (data.oldValue !== newPropertyValue) {
                setNewValue.apply(this.observedBean, [propertyName, newPropertyValue]);
                data.newValue = newPropertyValue;
                data.propertyChanged = propertyName;
                data.bean = this.observedBean;
                ki.helper.logDebug("Publishing change: " + data);
                this.publish(data);
            } else {
                ki.helper.logDebug("New value and old value are the same: " + newPropertyValue);
            }
        },
        /**
         * This function replaces the bean of the observable and publishes it's change
         * @param bean
         */
        updateBean: function(bean) {
            var data = {};
            if (!_.equal(this.observedBean, bean)) {
                data.oldValue = this.observedBean.clone();
                this.observedBean = bean;
                data.propertyChanged = '*';
                data.bean = bean;
                ki.helper.logDebug("Publishing change: " + data);
            } else {
                ki.helper.logDebug("New bean an old bean are equal: " + this.observedBean);
            }

        },
        /**
         * This method returns the bean of the observable
         * @return {*}
         */
        getBean: function getBean() {
            return this.observedBean;
        }
    };

    var TemplatedNode = function TemplatedNode(observable, templateId, node) {
        this.observable = observable;
        this.templateId = templateId;
        this.node = node;
        var self = this;
    };

    TemplatedNode.prototype = {
        repaint: function() {
            ki.helper.logDebug('Here I am');
            ki.helper.logDir(this);
            this.node.innerText = 'templateId=' + this.templateId + ', ' +
                'title=' + this.observable.getBean().title;

        },
        repaintFunction: function() {
            return function(data) {
                console.log('repaintFunction is called');
                console.dir(data);
                console.dir(this);
            }
        }
    };

    return {

        /**
         * This method builds based on a "simple" bean a new, observable object, that proved add/remove listener
         * functionality and /
         * @param bean
         * @return observableBean {Observable} An observable bean
         */
        makeObservable: function(bean) {
            var observableBean = new Observable(bean);
            return observableBean;
        },
        Article: function(id, title, url, description, votes) {
            return new constructors.Article(id, title, url, description, votes);
        },
        makeTemplatedNode: function(observable, templateId, node) {
            var templatedNode = new TemplatedNode(observable, templateId, node);
            // observable.subscribe(function() {templatedNode.repaint.apply(templatedNode)});
            observable.subscribe(function(data) { templatedNode.repaint.apply(templatedNode, data); });
            return templatedNode;
        }
    }
})();