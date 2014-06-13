"use strict";
/**
 * Created by holger on 12.06.2014.
 */
ki.namespace('ki.services');

/**
 * The factories module provides factories or mixin functions
 */
ki.services = (function() {

    var self = this;

    var cachedArticles = [
        {
            id: 1,
            title: 'Title 1',
            description: 'Description 1',
            url: 'URL1',
            sharedBy: 'hhe',
            votes: 45
        },
        {
            id: 2,
            title: 'Title 2',
            description: 'Description 2',
            url: 'URL2',
            sharedBy: 'aho',
            votes: 22
        }
    ];

    var cachedComments = [
        {
            id: 1,
            articleId: 1,
            text: 'Comment 1 for article 1',
            commentedBy: 'aho'
        },
        {
            id: 2,
            articleId: 1,
            text: 'Comment 2 for article 1',
            commentedBy: 'hhe'
        },
        {
            id: 3,
            articleId: 2,
            text: 'Comment 2 for article 2',
            commentedBy: 'hhe'
        },
        {
            id: 4,
            articleId: 2,
            text: 'Comment 2 for article 2',
            commentedBy: 'aho'
        }
    ];

    function checkLoopProperties(dataArray, idProperty) {
        if(dataArray === undefined || idProperty === undefined) {
            ki.helper.logWarn('Searching new ID with incomplete data, dataArray=' + dataArray + ", idProperty=" + idProperty);
            return false;
        }
        return true;
    }

    /**
     * This function generates a new ID for the article
     * @param dataArray {object[]} array to search for an id
     * @param idProperty {String} name of the property, that contains the id value
     * @return return the new max value or -1 if no value could be found
     * @private
     */
    function _getNewId(dataArray, idProperty) {
        var maxValue = -1;
        if(checkLoopProperties(dataArray, idProperty)) {
            for (var i = 0, len = dataArray.length; i < len; i += 1) {
                maxValue = (dataArray[i][idProperty] && dataArray[i][idProperty]) > maxValue ? dataArray[i][idProperty] : maxValue;
            }
            maxValue += 1;
            ki.helper.logDebug('New max value ' + maxValue);
        }
        return maxValue;
    }

    function _findPositionById(dataArray, idProperty, idValue) {
        if(!checkLoopProperties(dataArray, idProperty)) {
            return;
        }
        for (var i = 0, len = dataArray.length; i < len; i += 1) {
            if(dataArray[i][idProperty] && dataArray[i][idProperty] === idValue) {
                ki.helper.logDebug('Found item with id ' + idValue + ' at position ' + i);
                return i;
            }
        }
        ki.helper.logInfo('Found no item with id ' + idValue);
    }

    /**
     * This function loops over the data array and searches each element for a given property and add every matching element
     * to the result set
     * @param dataArray {Array} Array containing the data
     * @param idProperty {String} Name of the property to be matched}
     * @param idValue {*} Value of the property to be exactly matched
     * @return {Array} The matching elements of the original array
     * @private
     */
    function _filterCommentsForArticle(dataArray, idProperty, idValue) {
        var resultSet = [];
        if (!checkLoopProperties(dataArray, idProperty) && idValue) {
            return;
        }

        for (var i = 0, len = dataArray.length; i < len; i += 1) {
            if(dataArray[i][idProperty] && dataArray[i][idProperty] === idValue) {
                ki.helper.logDebug('Found item with id ' + idValue + ' at position ' + i);
                resultSet.push(dataArray[i]);
            }
        }
        return resultSet;
    }

    var _getArticles = function() {
        ki.helper.logDebug('Returning articles ' + cachedArticles);
        return cachedArticles;
    }

    function _addArticle(article) {
        // Do possibly some validation...
        var newId = _getNewId(cachedArticles, 'id');
        article.id = newId;
        cachedArticles.push(article);
    }

    function _updateArticle(newArticle) {
        var position;
        position = _findPositionById(cachedArticles, 'id', newArticle.id);
        if (position !== undefined) {
            cachedArticles[position] = newArticle;
        } else {
            ki.helper.logWarn('Article not found in cached articles. Article was ' + newArticle);
        }
    }

    function _deleteArticle(id) {
        var position;
        position = _findPositionById(cachedArticles, 'id', id);
        if (position !== undefined) {
            cachedArticles.splice([position],1);
        } else {
            ki.helper.logWarn('Article id ' + id + ' not found in cached articles.');
        }
    }

    function _getComments(articleId) {
        ki.helper.logDebug('Returning comments for article ' + articleId);
        return _filterCommentsForArticle(cachedComments, 'articleId', articleId);
    }

    function _updateComment(newComment) {
        var position;
        position = _findPositionById(cachedComments, 'id', newComment.id);
        if (position !== undefined) {
            cachedComments[position] = newComment;
        } else {
            ki.helper.logWarn('Comment not found in cached articles. Comment was ' + newComment);
        }
    }

    function _addComment(newComment) {
        // Do possibly some validation...
        var newId = _getNewId(cachedComments, 'id');
        newComment.id = newId;
        cachedComments.push(newComment);
    }

    function _deleteComment(id) {
        var position;
        position = _findPositionById(cachedComments, 'id', id);
        if (position !== undefined) {
            cachedComments.splice([position],1);
        } else {
            ki.helper.logWarn('Comment id ' + id + ' not found in cached comments.');
        }
    }

    return {
        /**
         * This method returns an array of articles
         * @return {article[]}
         */
        getArticles: function() {
            return _getArticles();
        },
        /**
         * This function updates an article in the articleCache
         * @param {article} newArticle
         */
        updateArticle: function(newArticle) {
            _updateArticle(newArticle);
        },
        /**
         * This method add a new article to the list of articles
         * and assigns it a new id
         * @param {article} newArticle
         */
        addArticle: function(newArticle) {
            _addArticle(newArticle);
        },
        deleteArticle: function(id) {
            _deleteArticle(id);
        },
        /**
         * This function returns the comments for a given articleId
         * @param articleId {Number}
         * @return comment[]
         */
        getComments: function(articleId) {
            return _getComments(articleId);
        },
        updateComment: function(updatedComment) {
            _updateComment(updatedComment)
        },
        addComment: function(newComment) {
            _addComment(newComment)
        },
        deleteComment: function(id) {
            _deleteComment(id);
        }
    };
})();
