/**
 * Created by holger on 16.06.2014.
 */

function Article(id, title, url, description, votes) {
    this.id = id;
    this.title = title;
    this.url = url;
    this.description = description;
    this.votes = votes;
}

function mixinGettersAndSetters(ConstructorFunction) {
    var tempObject = new ConstructorFunction;
    for (var prop in tempObject) {
        // important check that this is objects own property
        // not from prototype prop inherited
        if(tempObject.hasOwnProperty(prop)){
            console.log(prop + " = " + tempObject[prop]);
            var xxx = (function(prop) {
                var myprop = prop;
                console.log('Setting myprop=' + myprop);
                console.log('Setting prop=' + prop);
                return function() {
                    console.log(this);
                    console.log(myprop);
                    console.log(arguments.callee);
                    return this[myprop];
                }
            }
                )();
            ConstructorFunction.prototype['get' + prop] = (function(prop) {
                var myprop = prop;
                console.log('Setting myprop=' + myprop);
                console.log('Setting prop=' + prop);
                return function() {
                    console.log(this);
                    console.log(myprop);
                    console.log(arguments.callee);
                    return this[myprop];
                }
                }
            )();
        }
    }
}
