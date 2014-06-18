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
    var Observable = function(observedBean){
        this.subscribers = [];
        this.observedBean = observedBean;
/*
        this.bean = {};
        this.oldBean = {};
        var watchBean = function() {
            var self = this;
            if (!_.isEqual(self.bean, self.oldBean)) {
                console.log('change detected');
                this.publish(self.bean);
                self.oldBean = self.bean;
            }
            console.log('watched');
        };

        setTimeout(function() {
            watchBean();
        }, 500);
*/
    };
    Observable.prototype = {
        subscribe: function subscribe(callback) {
            if (!_.contains(this.subscribers, callback)) {
                this.subscribers.push(callback);
            }
        },
        unsubscribe: function unsubscribe(callback) {
            this.subscribers = _.without(this.subscribers, callback);
        },
        publish: function(data) {
            _.each(this.subscribers, function(element, index, list) {
                element(data);
            });
        },
        setBeanProperty: function setBeanProperty(propertyName, propertyValue) {
            var data = {};
            if(this.observedBean.hasOwnProperty(propertyName) && this.observedBean[propertyName] !== propertyValue) {
                data.oldValue = this.observedBean[propertyName];
                this.observedBean[propertyName] = propertyValue;
                data.newValue = this.observedBean[propertyName];
                data.bean = this.observedBean;
                console.log("Publishing change: " + data);
                this.publish(data);
            } else {
                console.log('Could not change value');
            }
        },
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
            // jQuery.extend(observableBean, bean);
            // observableBean.setBean(bean);
            return observableBean;
        },
        Article: function(id, title, url, description, votes) {
            return new constructors.Article(id, title, url, description, votes);
        }
    }
})();