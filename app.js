require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
T.scriptEnvironment = { resourcePath: '/actions' };
require("tribe/client/enhancedDebug").execute("require('tribe').register.actor(function (actor) {\n    var game;\n\n    actor.handles = {\n        onstart: function (data) {\n            game = data;\n        },\n        'action.queue.*': function (action) {\n            var object = game.map.objects(action.objectId);\n            object.queue.push(action.action, action.options);\n        },\n        'action.execute.*': function (action) {\n            var object = game.map.objects(action.objectId);\n            game.executeAction(object, action.action, action.options);\n        }\n    };\n});\n\n//@ sourceURL=http://app/actors/actions.js\n", arguments, window, require, module, exports);
(function () {require('tribe').register.actor(function (actor) {
    var game;

    actor.handles = {
        onstart: function (data) {
            game = data;
        },
        'action.queue.*': function (action) {
            var object = game.map.objects(action.objectId);
            object.queue.push(action.action, action.options);
        },
        'action.execute.*': function (action) {
            var object = game.map.objects(action.objectId);
            game.executeAction(object, action.action, action.options);
        }
    };
});
})
},{"tribe":"truKqQ","tribe/client/enhancedDebug":97}],2:[function(require,module,exports){
T.scriptEnvironment = { resourcePath: '/game' };
require("tribe/client/enhancedDebug").execute("require('tribe').register.actor(function (actor) {\n    actor.handles = {\n        onstart: function (game) {\n            //actor.data = game.data;\n            actor.game = game;\n\n            // these are separated to enable actions to be processed on the server\n            actor.startChild('actions', game);\n            actor.startChild('outcomes', game);\n\n            __ = game;\n        }\n    };\n});\n\n//@ sourceURL=http://app/actors/game.js\n", arguments, window, require, module, exports);
(function () {require('tribe').register.actor(function (actor) {
    actor.handles = {
        onstart: function (game) {
            //actor.data = game.data;
            actor.game = game;

            // these are separated to enable actions to be processed on the server
            actor.startChild('actions', game);
            actor.startChild('outcomes', game);

            __ = game;
        }
    };
});
})
},{"tribe":"truKqQ","tribe/client/enhancedDebug":97}],3:[function(require,module,exports){
T.scriptEnvironment = { resourcePath: '/outcomes' };
require("tribe/client/enhancedDebug").execute("var interactions = require('interactions'),\n        serializer = require('tribe/utilities/serializer'),\n    _ = require('underscore');\n\nrequire('tribe').register.actor(function (actor) {\n    var objects, game;\n\n    actor.handles = {\n        onstart: function (data) {\n            game = data;\n            objects = game.map.objects;\n        },\n        'outcome.*': function (outcome) {\n            interactions.applyOutcome(outcome.name, \n                objects(outcome.sourceId), \n                objects(outcome.targetId), \n                outcome.options, \n                game);\n        }\n    };\n\n    actor.postMessage = _.throttle(function () {\n        localStorage.setItem(\"game\", serializer.serialize(game.data));\n    }, 5000);\n});\n\n//@ sourceURL=http://app/actors/outcomes.js\n", arguments, window, require, module, exports);
(function () {var interactions = require('interactions'),
        serializer = require('tribe/utilities/serializer'),
    _ = require('underscore');

require('tribe').register.actor(function (actor) {
    var objects, game;

    actor.handles = {
        onstart: function (data) {
            game = data;
            objects = game.map.objects;
        },
        'outcome.*': function (outcome) {
            interactions.applyOutcome(outcome.name, 
                objects(outcome.sourceId), 
                objects(outcome.targetId), 
                outcome.options, 
                game);
        }
    };

    actor.postMessage = _.throttle(function () {
        localStorage.setItem("game", serializer.serialize(game.data));
    }, 5000);
});
})
},{"interactions":46,"tribe":"truKqQ","tribe/client/enhancedDebug":97,"tribe/utilities/serializer":105,"underscore":87}],4:[function(require,module,exports){
T.scriptEnvironment = { resourcePath: '/ui' };
require("tribe/client/enhancedDebug").execute("require('tribe').register.actor(function (actor) {\n    // adds effects for actions and outcomes\n    var objects = require('objects'),\n        damage = require('ui/effects/damage'),\n        projectile = require('ui/effects/projectile'),\n        model, map, game;\n\n    actor.handles = {\n        onstart: function (data) {\n            model = data.map;\n            game = data.game;\n            map = game.map;\n        },\n\n        'outcome.damage': function (outcome) {\n            var location = outcome.location,\n                effect = damage(outcome.options.value);\n            model.addEffect(location.row, location.col, effect);\n        },\n        'outcome.damageSource': function (outcome) {\n            var location = outcome.location,\n                effect = damage(outcome.options.value);\n            model.addEffect(location.row, location.col, effect);\n        },\n\n        'outcome.projectile': function (outcome) {\n            var source = map.objects(outcome.sourceId);\n            projectile(objects.create('arrow'), source.location(), outcome.location, map);\n        },\n\n        //'outcome.die': function (outcome) {\n\n        //},\n\n        'ui.showLocationItems': function (location) {\n            T.appendNode('body', {\n                path: '/popup',\n                data: {\n                    pane: '/itemActionList',\n                    data: { objects: map.tile(location).objects, close: 'ui.closeLocationItems', action: 'acquire', object: game.player },\n                    position: 'top',\n                    autoShow: true,\n                    removeOnHide: true,\n                    hide: 'ui.closeLocationItems'\n                }\n            });\n        }\n    };\n});\n//@ sourceURL=http://app/actors/ui.js\n", arguments, window, require, module, exports);
(function () {require('tribe').register.actor(function (actor) {
    // adds effects for actions and outcomes
    var objects = require('objects'),
        damage = require('ui/effects/damage'),
        projectile = require('ui/effects/projectile'),
        model, map, game;

    actor.handles = {
        onstart: function (data) {
            model = data.map;
            game = data.game;
            map = game.map;
        },

        'outcome.damage': function (outcome) {
            var location = outcome.location,
                effect = damage(outcome.options.value);
            model.addEffect(location.row, location.col, effect);
        },
        'outcome.damageSource': function (outcome) {
            var location = outcome.location,
                effect = damage(outcome.options.value);
            model.addEffect(location.row, location.col, effect);
        },

        'outcome.projectile': function (outcome) {
            var source = map.objects(outcome.sourceId);
            projectile(objects.create('arrow'), source.location(), outcome.location, map);
        },

        //'outcome.die': function (outcome) {

        //},

        'ui.showLocationItems': function (location) {
            T.appendNode('body', {
                path: '/popup',
                data: {
                    pane: '/itemActionList',
                    data: { objects: map.tile(location).objects, close: 'ui.closeLocationItems', action: 'acquire', object: game.player },
                    position: 'top',
                    autoShow: true,
                    removeOnHide: true,
                    hide: 'ui.closeLocationItems'
                }
            });
        }
    };
});})
},{"objects":67,"tribe":"truKqQ","tribe/client/enhancedDebug":97,"ui/effects/damage":81,"ui/effects/projectile":82}],5:[function(require,module,exports){
T.scriptEnvironment = { resourcePath: '/createGame' };
require("tribe/client/enhancedDebug").execute("require('tribe').register.model(function (pane) {\n    var gameModule = require('game');\n\n    this.playerName = ko.observable();\n\n    this.start = function () {\n        pane.navigate('mobile/game', gameModule.create());\n    };\n});\n//@ sourceURL=http://app/panes/createGame.js\n", arguments, window, require, module, exports);
(function () {require('tribe').register.model(function (pane) {
    var gameModule = require('game');

    this.playerName = ko.observable();

    this.start = function () {
        pane.navigate('mobile/game', gameModule.create());
    };
});})
},{"game":45,"tribe":"truKqQ","tribe/client/enhancedDebug":97}],6:[function(require,module,exports){
T.scriptEnvironment = { resourcePath: '/inventory' };
require("tribe/client/enhancedDebug").execute("require('tribe').register.model(function (pane) {\n    var self = this,\n        queries = require('objects/queries'),\n        categories = require('objects/categories'),\n        inventory = pane.data.player.inventory;\n\n    this.gold = inventory.gold;\n    this.groups = queries.groupByCategory(inventory.items);\n    this.categories = categories;\n\n    this.executeAction = function (object) {\n        return function (action) {\n            pane.pubsub.publish('action.queue.' + action.action, {\n                action: action.action,\n                objectId: pane.data.player.id,\n                options: { targetId: object.id }\n            });\n        };\n    };\n\n    this.display = function (object) {\n        if (object.data.quantity)\n            return object.data.quantity + object.type;\n        return object.type;\n    };\n\n    this.image = function (action, object) {\n        if (inventory.equipped(object.category)() === object)\n            return action.equippedImage;\n        return action.image;\n    }\n\n    this.dispose = this.groups.dispose;\n});\n//@ sourceURL=http://app/panes/inventory.js\n", arguments, window, require, module, exports);
(function () {require('tribe').register.model(function (pane) {
    var self = this,
        queries = require('objects/queries'),
        categories = require('objects/categories'),
        inventory = pane.data.player.inventory;

    this.gold = inventory.gold;
    this.groups = queries.groupByCategory(inventory.items);
    this.categories = categories;

    this.executeAction = function (object) {
        return function (action) {
            pane.pubsub.publish('action.queue.' + action.action, {
                action: action.action,
                objectId: pane.data.player.id,
                options: { targetId: object.id }
            });
        };
    };

    this.display = function (object) {
        if (object.data.quantity)
            return object.data.quantity + object.type;
        return object.type;
    };

    this.image = function (action, object) {
        if (inventory.equipped(object.category)() === object)
            return action.equippedImage;
        return action.image;
    }

    this.dispose = this.groups.dispose;
});})
},{"objects/categories":64,"objects/queries":69,"tribe":"truKqQ","tribe/client/enhancedDebug":97}],7:[function(require,module,exports){
T.scriptEnvironment = { resourcePath: '/itemActionList' };
require("tribe/client/enhancedDebug").execute("require('tribe').register.model(function (pane) {\n    var self = this;\n\n    this.objects = pane.data.objects;\n\n    this.all = function () {\n        self.close();\n        pane.pubsub.publish('action.queue.' + pane.data.action, {\n            action: 'acquire',\n            objectId: pane.data.object.id,\n            options: { location: pane.data.object.location() }\n        });\n    };\n\n    this.select = function (object) {\n        pane.pubsub.publish('action.queue.' + pane.data.action, {\n            action: 'acquire',\n            objectId: pane.data.object.id,\n            options: { targetId: object.id }\n        });\n    };\n\n    this.close = function () {\n        pane.pubsub.publish(pane.data.close);\n    };\n});\n//@ sourceURL=http://app/panes/itemActionList.js\n", arguments, window, require, module, exports);
(function () {require('tribe').register.model(function (pane) {
    var self = this;

    this.objects = pane.data.objects;

    this.all = function () {
        self.close();
        pane.pubsub.publish('action.queue.' + pane.data.action, {
            action: 'acquire',
            objectId: pane.data.object.id,
            options: { location: pane.data.object.location() }
        });
    };

    this.select = function (object) {
        pane.pubsub.publish('action.queue.' + pane.data.action, {
            action: 'acquire',
            objectId: pane.data.object.id,
            options: { targetId: object.id }
        });
    };

    this.close = function () {
        pane.pubsub.publish(pane.data.close);
    };
});})
},{"tribe":"truKqQ","tribe/client/enhancedDebug":97}],8:[function(require,module,exports){
T.scriptEnvironment = { resourcePath: '/itemList' };
require("tribe/client/enhancedDebug").execute("require('tribe').register.model(function (pane) {\n    var self = this,\n        queries = require('objects/queries');\n\n    this.categories = queries.groupByCategory(pane.data.objects);\n\n    this.select = function (object) {\n        pane.data.select(object);\n    };\n\n    this.display = function (object) {\n        if (object.data.quantity)\n            return object.data.quantity + ' ' + object.type;\n        return object.type;\n    };\n\n    if (pane.data.close)\n        this.categories.subscribe(function () {\n            if (self.categories().length === 0)\n                pane.data.close();\n        });\n\n    this.dispose = this.categories.dispose;\n});\n//@ sourceURL=http://app/panes/itemList.js\n", arguments, window, require, module, exports);
(function () {require('tribe').register.model(function (pane) {
    var self = this,
        queries = require('objects/queries');

    this.categories = queries.groupByCategory(pane.data.objects);

    this.select = function (object) {
        pane.data.select(object);
    };

    this.display = function (object) {
        if (object.data.quantity)
            return object.data.quantity + ' ' + object.type;
        return object.type;
    };

    if (pane.data.close)
        this.categories.subscribe(function () {
            if (self.categories().length === 0)
                pane.data.close();
        });

    this.dispose = this.categories.dispose;
});})
},{"objects/queries":69,"tribe":"truKqQ","tribe/client/enhancedDebug":97}],9:[function(require,module,exports){
T.scriptEnvironment = { resourcePath: '/layout' };
require("tribe/client/enhancedDebug").execute("require('ui/bindingHandlers');\n\nrequire('tribe').register.model(function (pane) {\n    var actor = pane.pubsub.startActor('id', 'game');    \n    require('ui/input/keyboard').attach(actor.game.player, actor.game.map);\n    this.game = actor.game;\n});\n//@ sourceURL=http://app/panes/layout.js\n", arguments, window, require, module, exports);
(function () {require('ui/bindingHandlers');

require('tribe').register.model(function (pane) {
    var actor = pane.pubsub.startActor('id', 'game');    
    require('ui/input/keyboard').attach(actor.game.player, actor.game.map);
    this.game = actor.game;
});})
},{"tribe":"truKqQ","tribe/client/enhancedDebug":97,"ui/bindingHandlers":80,"ui/input/keyboard":84}],10:[function(require,module,exports){
T.scriptEnvironment = { resourcePath: '/map' };
require("tribe/client/enhancedDebug").execute("require('tribe').register.model(function (pane) {\n    var self = this,\n        model = require('ui/models/map'),\n        game = pane.data,\n        map = model(game.map);\n\n    this.tiles = map.tiles;\n\n    pane.pubsub.startActor('uiActor', 'ui', {\n        game: game,\n        map: map\n    });\n});\n//@ sourceURL=http://app/panes/map.js\n", arguments, window, require, module, exports);
(function () {require('tribe').register.model(function (pane) {
    var self = this,
        model = require('ui/models/map'),
        game = pane.data,
        map = model(game.map);

    this.tiles = map.tiles;

    pane.pubsub.startActor('uiActor', 'ui', {
        game: game,
        map: map
    });
});})
},{"tribe":"truKqQ","tribe/client/enhancedDebug":97,"ui/models/map":85}],11:[function(require,module,exports){
T.scriptEnvironment = { resourcePath: '/mobile/actions' };
require("tribe/client/enhancedDebug").execute("require('tribe').register.model(function (pane) {\n    var self = this,\n        actions = require('ui/input/actions'),\n        pubsub = pane.pubsub,\n        game = pane.data,\n        map = game.map,\n        player = game.player,\n        subscription = player.location.subscribe(update);\n\n    this.actions = ko.observableArray();\n\n    this.tap = function (action, e) {\n        if(action.tap)\n            pubsub.publish(action.tap);\n    }\n\n    this.hold = function (action, e) {\n        if (action.hold)\n            pubsub.publish(action.hold);\n    }\n\n    this.classes = function (action) {\n        var classes = {};\n        classes[action.icon] = true;\n        return classes;\n    }\n\n    pane.pubsub.subscribe('outcome.acquire', function () {\n        update(player.location());\n    });\n\n    function update(location) {\n        self.actions(actions.forPlayerLocation(map, location, player));\n    }\n\n    this.dispose = subscription.dispose;\n});\n//@ sourceURL=http://app/panes/mobile/actions.js\n", arguments, window, require, module, exports);
(function () {require('tribe').register.model(function (pane) {
    var self = this,
        actions = require('ui/input/actions'),
        pubsub = pane.pubsub,
        game = pane.data,
        map = game.map,
        player = game.player,
        subscription = player.location.subscribe(update);

    this.actions = ko.observableArray();

    this.tap = function (action, e) {
        if(action.tap)
            pubsub.publish(action.tap);
    }

    this.hold = function (action, e) {
        if (action.hold)
            pubsub.publish(action.hold);
    }

    this.classes = function (action) {
        var classes = {};
        classes[action.icon] = true;
        return classes;
    }

    pane.pubsub.subscribe('outcome.acquire', function () {
        update(player.location());
    });

    function update(location) {
        self.actions(actions.forPlayerLocation(map, location, player));
    }

    this.dispose = subscription.dispose;
});})
},{"tribe":"truKqQ","tribe/client/enhancedDebug":97,"ui/input/actions":83}],12:[function(require,module,exports){
T.scriptEnvironment = { resourcePath: '/mobile/content' };
require("tribe/client/enhancedDebug").execute("require('tribe').register.model(function (pane) {\n    var game = pane.data,\n        player = game.player;\n\n    this.game = game;\n    this.renderComplete = updateScreenPosition;\n    player.location.subscribe(updateScreenPosition);\n\n    function updateScreenPosition() {\n        var location = player.location(),\n            element = $('.map > div').eq(location.row).children().eq(location.col);\n\n        $('.content').css({\n            top: $(window).height() / 2 - element.position().top - element.height() / 2,\n            left: $(window).width() / 2 - element.position().left - element.width() / 2\n        });\n    }\n});\n//@ sourceURL=http://app/panes/mobile/content.js\n", arguments, window, require, module, exports);
(function () {require('tribe').register.model(function (pane) {
    var game = pane.data,
        player = game.player;

    this.game = game;
    this.renderComplete = updateScreenPosition;
    player.location.subscribe(updateScreenPosition);

    function updateScreenPosition() {
        var location = player.location(),
            element = $('.map > div').eq(location.row).children().eq(location.col);

        $('.content').css({
            top: $(window).height() / 2 - element.position().top - element.height() / 2,
            left: $(window).width() / 2 - element.position().left - element.width() / 2
        });
    }
});})
},{"tribe":"truKqQ","tribe/client/enhancedDebug":97}],13:[function(require,module,exports){
T.scriptEnvironment = { resourcePath: '/mobile/control' };
require("tribe/client/enhancedDebug").execute("require('tribe').register.model(function (pane) {\n    // mmm in need of a refactor...\n\n    var actions = require('ui/input/actions'),\n        player = pane.data.player,\n        queue = require('actions/queue')(pane.pubsub, { id: player.id, attributes: player.attributes }, 'queue', nextAction),\n        location = require('utilities/location'),\n        utils = require('utilities/octant'),\n        serializer = require('tribe/utilities/serializer'),\n        isTouch = 'ontouchstart' in document.documentElement,\n\n        game = pane.data,\n        map = game.map,\n        player = game.player,\n        attacking = false,\n        currentDirection, currentAngle;\n\n    this.rangedWeaponEquipped = function () {\n        return player.inventory.equipped('wr')();\n    };\n\n    this.renderComplete = function () {\n        pane.find('.attackButton')\n            .on('touchstart touchmove touchend', function (e) {\n                attacking = e.originalEvent.targetTouches.length > 0;\n                currentAngle = attacking && getAngle(e);\n                e.stopPropagation();\n            });\n\n        // allow using 'r' key on keyboard for testing purposes\n        $(document).keydown(function (e) {\n            if (e.which === 82) {\n                attacking = true;\n                e.stopPropagation();\n            }\n        });\n\n        $(document).keyup(function (e) {\n            if (e.which === 82) {\n                attacking = false;\n                e.stopPropagation();\n            }\n        });\n\n        pane.find('.control')\n            .on(isTouch ? 'touchstart' : 'mousedown', function (e) {\n                var direction = utils.asDirection(getOctant(e));\n                start(direction);\n\n                currentAngle = attacking && getAngle(e);\n\n                var action = nextAction();\n                if (action)\n                    queue.push(action.action, action.options);\n            })\n            .on('touchmove', function (e) {\n                move(utils.asDirection(getOctant(e)));\n                currentAngle = attacking && getAngle(e);\n                e.preventDefault();\n            })\n            .on(isTouch ? 'touchend' : 'mouseup', function (e) {\n                end();\n                currentAngle = undefined;\n            });\n    };\n\n    function nextAction() {\n        if (currentDirection) {\n            if (attacking)\n                return actions.forAttackAngle(map, currentAngle, player);\n            else\n                return actions.forLocation(map, location.direction(currentDirection, player.location()), player);\n        }\n    }\n\n    function start(direction) {\n        show(direction);\n        currentDirection = direction;\n    }\n\n    function move(direction) {\n        if (currentDirection !== direction) {\n            hide(currentDirection);\n            currentDirection = direction;\n            show(currentDirection);\n        }\n    }\n\n    function end() {\n        hide(currentDirection);\n        currentDirection = undefined;\n    }\n\n    function show(direction) {\n        var element = pane.find('.' + direction);\n        element.addClass('active');\n    }\n\n    function hide(direction) {\n        var element = pane.find('.' + direction)\n            .addClass('transition')\n            .removeClass('active');\n\n        setTimeout(function () {\n            element.removeClass('transition');\n        }, 500); // this is set in CSS. Probably should do this in an event handler\n    }\n\n    function getOctant(e) {\n        var positionSource = e;\n        if (e.originalEvent.targetTouches)\n            positionSource = e.originalEvent.targetTouches[0];\n\n        // rotate this 180 degrees so we're not touching where we want to go!\n        return (utils.getElementOctant('.control', positionSource.pageX, positionSource.pageY) + 4) % 8;\n    }\n\n    function getAngle(e) {\n        var positionSource = e;\n        if (e.originalEvent.targetTouches)\n            positionSource = e.originalEvent.targetTouches[0];\n\n        var element = $(window),\n            x = positionSource.pageX - element.width() / 2,\n            y = positionSource.pageY - element.height() / 2,\n            angle = Math.atan2(y, x);\n\n        // rotate 180 degrees\n        return (angle + Math.PI) % (Math.PI * 2);\n    }\n});\n//@ sourceURL=http://app/panes/mobile/control.js\n", arguments, window, require, module, exports);
(function () {require('tribe').register.model(function (pane) {
    // mmm in need of a refactor...

    var actions = require('ui/input/actions'),
        player = pane.data.player,
        queue = require('actions/queue')(pane.pubsub, { id: player.id, attributes: player.attributes }, 'queue', nextAction),
        location = require('utilities/location'),
        utils = require('utilities/octant'),
        serializer = require('tribe/utilities/serializer'),
        isTouch = 'ontouchstart' in document.documentElement,

        game = pane.data,
        map = game.map,
        player = game.player,
        attacking = false,
        currentDirection, currentAngle;

    this.rangedWeaponEquipped = function () {
        return player.inventory.equipped('wr')();
    };

    this.renderComplete = function () {
        pane.find('.attackButton')
            .on('touchstart touchmove touchend', function (e) {
                attacking = e.originalEvent.targetTouches.length > 0;
                currentAngle = attacking && getAngle(e);
                e.stopPropagation();
            });

        // allow using 'r' key on keyboard for testing purposes
        $(document).keydown(function (e) {
            if (e.which === 82) {
                attacking = true;
                e.stopPropagation();
            }
        });

        $(document).keyup(function (e) {
            if (e.which === 82) {
                attacking = false;
                e.stopPropagation();
            }
        });

        pane.find('.control')
            .on(isTouch ? 'touchstart' : 'mousedown', function (e) {
                var direction = utils.asDirection(getOctant(e));
                start(direction);

                currentAngle = attacking && getAngle(e);

                var action = nextAction();
                if (action)
                    queue.push(action.action, action.options);
            })
            .on('touchmove', function (e) {
                move(utils.asDirection(getOctant(e)));
                currentAngle = attacking && getAngle(e);
                e.preventDefault();
            })
            .on(isTouch ? 'touchend' : 'mouseup', function (e) {
                end();
                currentAngle = undefined;
            });
    };

    function nextAction() {
        if (currentDirection) {
            if (attacking)
                return actions.forAttackAngle(map, currentAngle, player);
            else
                return actions.forLocation(map, location.direction(currentDirection, player.location()), player);
        }
    }

    function start(direction) {
        show(direction);
        currentDirection = direction;
    }

    function move(direction) {
        if (currentDirection !== direction) {
            hide(currentDirection);
            currentDirection = direction;
            show(currentDirection);
        }
    }

    function end() {
        hide(currentDirection);
        currentDirection = undefined;
    }

    function show(direction) {
        var element = pane.find('.' + direction);
        element.addClass('active');
    }

    function hide(direction) {
        var element = pane.find('.' + direction)
            .addClass('transition')
            .removeClass('active');

        setTimeout(function () {
            element.removeClass('transition');
        }, 500); // this is set in CSS. Probably should do this in an event handler
    }

    function getOctant(e) {
        var positionSource = e;
        if (e.originalEvent.targetTouches)
            positionSource = e.originalEvent.targetTouches[0];

        // rotate this 180 degrees so we're not touching where we want to go!
        return (utils.getElementOctant('.control', positionSource.pageX, positionSource.pageY) + 4) % 8;
    }

    function getAngle(e) {
        var positionSource = e;
        if (e.originalEvent.targetTouches)
            positionSource = e.originalEvent.targetTouches[0];

        var element = $(window),
            x = positionSource.pageX - element.width() / 2,
            y = positionSource.pageY - element.height() / 2,
            angle = Math.atan2(y, x);

        // rotate 180 degrees
        return (angle + Math.PI) % (Math.PI * 2);
    }
});})
},{"actions/queue":35,"tribe":"truKqQ","tribe/client/enhancedDebug":97,"tribe/utilities/serializer":105,"ui/input/actions":83,"utilities/location":89,"utilities/octant":94}],14:[function(require,module,exports){
T.scriptEnvironment = { resourcePath: '/mobile/game' };
require("tribe/client/enhancedDebug").execute("require('ui/bindingHandlers');\n\nrequire('tribe').register.model(function (pane) {\n    var self = this;\n\n    this.initialise = function () {\n        var actor = pane.pubsub.startActor('id', 'game', pane.data);\n        require('ui/input/keyboard').attach(actor.game.player, actor.game.map);\n        self.game = actor.game;\n    }\n});\n//@ sourceURL=http://app/panes/mobile/game.js\n", arguments, window, require, module, exports);
(function () {require('ui/bindingHandlers');

require('tribe').register.model(function (pane) {
    var self = this;

    this.initialise = function () {
        var actor = pane.pubsub.startActor('id', 'game', pane.data);
        require('ui/input/keyboard').attach(actor.game.player, actor.game.map);
        self.game = actor.game;
    }
});})
},{"tribe":"truKqQ","tribe/client/enhancedDebug":97,"ui/bindingHandlers":80,"ui/input/keyboard":84}],15:[function(require,module,exports){
T.scriptEnvironment = { resourcePath: '/mobile/messages' };
require("tribe/client/enhancedDebug").execute("require('tribe').register.model(function (pane) {\n    var self = this;\n\n    pane.pubsub.subscribe('ui.message', function (message) {\n        var element = $('<div>' + message.text + '</div>')\n            .prependTo(pane.find('.messages'))\n            .on('transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd', function () {\n                element.remove();\n            });\n\n        setTimeout(function () {\n            element.css('opacity', 0);\n        }, 20);\n    })\n});\n//@ sourceURL=http://app/panes/mobile/messages.js\n", arguments, window, require, module, exports);
(function () {require('tribe').register.model(function (pane) {
    var self = this;

    pane.pubsub.subscribe('ui.message', function (message) {
        var element = $('<div>' + message.text + '</div>')
            .prependTo(pane.find('.messages'))
            .on('transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd', function () {
                element.remove();
            });

        setTimeout(function () {
            element.css('opacity', 0);
        }, 20);
    })
});})
},{"tribe":"truKqQ","tribe/client/enhancedDebug":97}],16:[function(require,module,exports){
T.scriptEnvironment = { resourcePath: '/mobile/status' };
require("tribe/client/enhancedDebug").execute("require('tribe').register.model(function (pane) {\n    var player = pane.data.player;\n\n    this.game = pane.data;\n    this.attributes = player.attributes;\n    this.inventory = player.inventory;\n\n    this.showInventory = function () {\n        pane.pubsub.publish('ui.showInventory');\n    };\n});\n//@ sourceURL=http://app/panes/mobile/status.js\n", arguments, window, require, module, exports);
(function () {require('tribe').register.model(function (pane) {
    var player = pane.data.player;

    this.game = pane.data;
    this.attributes = player.attributes;
    this.inventory = player.inventory;

    this.showInventory = function () {
        pane.pubsub.publish('ui.showInventory');
    };
});})
},{"tribe":"truKqQ","tribe/client/enhancedDebug":97}],17:[function(require,module,exports){
T.scriptEnvironment = { resourcePath: '/mobile/toolbar' };
require("tribe/client/enhancedDebug").execute("require('tribe').register.model(function (pane) {\n    var _ = require('underscore');\n\n    this.buttons = [\n        { image: 'inventory.png' },\n        { image: 'character.png' },\n        { image: 'swap.png' },\n        { image: 'add.png' },\n        { image: 'more.png' }\n    ];\n\n    this.pulse = function (data, event) {\n        var element = $(event.target).addClass('active');\n        setTimeout(function () {\n            element.addClass('transition').removeClass('active');\n            setTimeout(function () {\n                element.removeClass('transition');\n            }, 500);\n        }, 20);\n    };\n});\n//@ sourceURL=http://app/panes/mobile/toolbar.js\n", arguments, window, require, module, exports);
(function () {require('tribe').register.model(function (pane) {
    var _ = require('underscore');

    this.buttons = [
        { image: 'inventory.png' },
        { image: 'character.png' },
        { image: 'swap.png' },
        { image: 'add.png' },
        { image: 'more.png' }
    ];

    this.pulse = function (data, event) {
        var element = $(event.target).addClass('active');
        setTimeout(function () {
            element.addClass('transition').removeClass('active');
            setTimeout(function () {
                element.removeClass('transition');
            }, 500);
        }, 20);
    };
});})
},{"tribe":"truKqQ","tribe/client/enhancedDebug":97,"underscore":87}],18:[function(require,module,exports){
T.scriptEnvironment = { resourcePath: '/popup' };
require("tribe/client/enhancedDebug").execute("require('tribe').register.model(function (pane) {\n    var self = this;\n\n    pane.node.skipPath = true;\n\n    this.pane = pane.data.pane;\n    this.data = pane.data.data;\n    this.position = pane.data.position || 'bottom';\n\n    this.renderComplete = function () {\n        if (pane.data.autoShow)\n            self.show();\n    };\n\n    this.show = function () {\n        var element = pane.find('.popup > div');\n        element.css(self.position, -element.outerHeight());\n\n        setTimeout(function () {\n            element\n                .addClass('slide')\n                .css(self.position, 0);\n        }, 20);\n    };\n\n    this.hide = function () {\n        var element = pane.find('.popup > div');\n\n        element.css(self.position, -element.outerHeight());\n\n        element.on('transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd', transitionEnd);\n\n        function transitionEnd() {\n            element.off('transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd', transitionEnd);\n            if (pane.data.removeOnHide)\n                pane.remove();\n            else\n                element\n                    .css(self.position, '')\n                    .removeClass('slide');\n        }\n    }\n\n    if (pane.data.show)\n        pane.pubsub.subscribe(pane.data.show, this.show);\n\n    if (pane.data.hide)\n        pane.pubsub.subscribe(pane.data.hide, this.hide);\n});\n//@ sourceURL=http://app/panes/popup.js\n", arguments, window, require, module, exports);
(function () {require('tribe').register.model(function (pane) {
    var self = this;

    pane.node.skipPath = true;

    this.pane = pane.data.pane;
    this.data = pane.data.data;
    this.position = pane.data.position || 'bottom';

    this.renderComplete = function () {
        if (pane.data.autoShow)
            self.show();
    };

    this.show = function () {
        var element = pane.find('.popup > div');
        element.css(self.position, -element.outerHeight());

        setTimeout(function () {
            element
                .addClass('slide')
                .css(self.position, 0);
        }, 20);
    };

    this.hide = function () {
        var element = pane.find('.popup > div');

        element.css(self.position, -element.outerHeight());

        element.on('transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd', transitionEnd);

        function transitionEnd() {
            element.off('transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd', transitionEnd);
            if (pane.data.removeOnHide)
                pane.remove();
            else
                element
                    .css(self.position, '')
                    .removeClass('slide');
        }
    }

    if (pane.data.show)
        pane.pubsub.subscribe(pane.data.show, this.show);

    if (pane.data.hide)
        pane.pubsub.subscribe(pane.data.hide, this.hide);
});})
},{"tribe":"truKqQ","tribe/client/enhancedDebug":97}],19:[function(require,module,exports){
T.scriptEnvironment = { resourcePath: '/selectGame' };
require("tribe/client/enhancedDebug").execute("require('tribe').register.model(function (pane) {\n    var self = this,\n        serializer = require('tribe/utilities/serializer'),\n        gameModule = require('game');\n\n    this.playerName = ko.observable();\n    this.savedGames = savedGames();\n\n    this.startNew = function () {\n        pane.navigate('createGame');\n    };\n\n    this.resume = function (game) {\n        var data = serializer.deserialize(localStorage.getItem('game')),\n            game = gameModule.load(data);\n        pane.navigate('mobile/game', game);\n    };\n\n    function savedGames() {\n        return [{ name: 'test' }];\n    }\n});\n//@ sourceURL=http://app/panes/selectGame.js\n", arguments, window, require, module, exports);
(function () {require('tribe').register.model(function (pane) {
    var self = this,
        serializer = require('tribe/utilities/serializer'),
        gameModule = require('game');

    this.playerName = ko.observable();
    this.savedGames = savedGames();

    this.startNew = function () {
        pane.navigate('createGame');
    };

    this.resume = function (game) {
        var data = serializer.deserialize(localStorage.getItem('game')),
            game = gameModule.load(data);
        pane.navigate('mobile/game', game);
    };

    function savedGames() {
        return [{ name: 'test' }];
    }
});})
},{"game":45,"tribe":"truKqQ","tribe/client/enhancedDebug":97,"tribe/utilities/serializer":105}],20:[function(require,module,exports){
T.scriptEnvironment = { resourcePath: '/status' };
require("tribe/client/enhancedDebug").execute("require('tribe').register.model(function (pane) {\n    var self = this,\n        timeout;\n\n    this.message = ko.observable();\n\n    pane.pubsub.subscribe('message.show', function (message) {\n        self.message(message);\n\n        if(timeout)\n            clearTimeout(timeout);\n\n        timeout = setTimeout(function () {\n            self.message('');\n        }, 2000);\n    });\n});\n//@ sourceURL=http://app/panes/status.js\n", arguments, window, require, module, exports);
(function () {require('tribe').register.model(function (pane) {
    var self = this,
        timeout;

    this.message = ko.observable();

    pane.pubsub.subscribe('message.show', function (message) {
        self.message(message);

        if(timeout)
            clearTimeout(timeout);

        timeout = setTimeout(function () {
            self.message('');
        }, 2000);
    });
});})
},{"tribe":"truKqQ","tribe/client/enhancedDebug":97}],21:[function(require,module,exports){
require("tribe/client/enhancedDebug").execute("var hub = require('./hub'),\n    serializer = require('tribe/utilities/serializer'),\n    pubsub = require('tribe.pubsub');\n\nTribe.PubSub.prototype.startActor = function (id, path, data) {\n    if (path.charAt(0) !== '/')\n        path = '/' + path;\n\n    var actor = new Tribe.PubSub.Actor(this, actorDefinition(path));\n\n    if (actor.runsOnServer) {\n        attachToHub(actor);\n        hub.startActor(path, id, data);\n    }\n\n    return actor.start(data);\n};\n\nTribe.PubSub.prototype.joinActor = function (id, path, data) {\n    var deferred = $.Deferred();\n    var self = this;\n    $.when($.get('Data/' + id + '/' + id))\n        .done(function (data) {\n            var actor = new Tribe.PubSub.Actor(self, actorDefinition(data.path));\n            actor.id = id;\n            actor.join(serializer.deserialize(data.data));\n            attachToHub(actor);\n            deferred.resolve(actor);\n        })\n        .fail(function (reason) {\n            if (reason.status === 404 && path) {\n                var actor = self.startActor(id, path, data);\n                deferred.resolve(actor);\n            }\n            else deferred.reject(reason);\n\n        });\n    return deferred;\n};\n\nfunction actorDefinition(path) {\n    return T.context().actors[path].constructor;\n}\n\n// need to also be able to detach\nfunction attachToHub(actor) {\n    hub.join(actor.id);\n    actor.pubsub.subscribe(actor.topics, function (message, envelope) {\n        envelope.actorId = actor.id;\n        hub.publish(envelope);\n    });\n}\n\nTribe.PubSub.Lifetime.prototype.startActor = Tribe.PubSub.prototype.startActor;\nTribe.PubSub.Lifetime.prototype.joinActor = Tribe.PubSub.prototype.joinActor;\nTribe.PubSub.Channel.prototype.startActor = Tribe.PubSub.prototype.startActor;\nTribe.PubSub.Channel.prototype.joinActor = Tribe.PubSub.prototype.joinActor;\n\nTribe.PubSub.Channel.prototype.connect = function (topics) {\n    var self = this;\n\n    hub.join(this.id);\n    this.subscribe(topics || '*', function(data, envelope) {\n        hub.publish(envelope);\n    });\n\n    var end = this.end;\n    this.end = function() {\n        hub.leave(self.channelId);\n        end();\n    };\n\n    return this;\n};\n\n//@ sourceURL=http://tribe//client/Pubsub.extensions.js\n", arguments, window, require, module, exports);
(function () {var hub = require('./hub'),
    serializer = require('tribe/utilities/serializer'),
    pubsub = require('tribe.pubsub');

Tribe.PubSub.prototype.startActor = function (id, path, data) {
    if (path.charAt(0) !== '/')
        path = '/' + path;

    var actor = new Tribe.PubSub.Actor(this, actorDefinition(path));

    if (actor.runsOnServer) {
        attachToHub(actor);
        hub.startActor(path, id, data);
    }

    return actor.start(data);
};

Tribe.PubSub.prototype.joinActor = function (id, path, data) {
    var deferred = $.Deferred();
    var self = this;
    $.when($.get('Data/' + id + '/' + id))
        .done(function (data) {
            var actor = new Tribe.PubSub.Actor(self, actorDefinition(data.path));
            actor.id = id;
            actor.join(serializer.deserialize(data.data));
            attachToHub(actor);
            deferred.resolve(actor);
        })
        .fail(function (reason) {
            if (reason.status === 404 && path) {
                var actor = self.startActor(id, path, data);
                deferred.resolve(actor);
            }
            else deferred.reject(reason);

        });
    return deferred;
};

function actorDefinition(path) {
    return T.context().actors[path].constructor;
}

// need to also be able to detach
function attachToHub(actor) {
    hub.join(actor.id);
    actor.pubsub.subscribe(actor.topics, function (message, envelope) {
        envelope.actorId = actor.id;
        hub.publish(envelope);
    });
}

Tribe.PubSub.Lifetime.prototype.startActor = Tribe.PubSub.prototype.startActor;
Tribe.PubSub.Lifetime.prototype.joinActor = Tribe.PubSub.prototype.joinActor;
Tribe.PubSub.Channel.prototype.startActor = Tribe.PubSub.prototype.startActor;
Tribe.PubSub.Channel.prototype.joinActor = Tribe.PubSub.prototype.joinActor;

Tribe.PubSub.Channel.prototype.connect = function (topics) {
    var self = this;

    hub.join(this.id);
    this.subscribe(topics || '*', function(data, envelope) {
        hub.publish(envelope);
    });

    var end = this.end;
    this.end = function() {
        hub.leave(self.channelId);
        end();
    };

    return this;
};
})
},{"./hub":23,"tribe.pubsub":104,"tribe/client/enhancedDebug":97,"tribe/utilities/serializer":105}],22:[function(require,module,exports){
require("tribe/client/enhancedDebug").execute("var _startChild = Tribe.PubSub.Actor.prototype.startChild;\n\nTribe.PubSub.Actor.prototype.startChild = function (child, onstartData) {\n    if (child.constructor === String)\n        child = actorDefinition(child);\n\n    _startChild.call(this, child, onstartData);\n}\n\nfunction actorDefinition(path) {\n    if (path.charAt(0) !== '/')\n        path = '/' + path;\n\n    return T.context().actors[path].constructor;\n}\n\n//@ sourceURL=http://tribe//client/Pubsub.overrides.js\n", arguments, window, require, module, exports);
(function () {var _startChild = Tribe.PubSub.Actor.prototype.startChild;

Tribe.PubSub.Actor.prototype.startChild = function (child, onstartData) {
    if (child.constructor === String)
        child = actorDefinition(child);

    _startChild.call(this, child, onstartData);
}

function actorDefinition(path) {
    if (path.charAt(0) !== '/')
        path = '/' + path;

    return T.context().actors[path].constructor;
}
})
},{"tribe/client/enhancedDebug":97}],23:[function(require,module,exports){
require("tribe/client/enhancedDebug").execute("var pubsub = require('tribe.pubsub'),\n    socket;\n\nvar hub = module.exports = {\n    connect: function () {\n        socket = io.connect();\n\n        socket.on('message', function (envelope) {\n            envelope.origin = 'server';\n            pubsub.publish(envelope);\n        });\n    },\n\n    publish: function(envelope) {\n        if (!socket) hub.connect();\n\n        if(envelope.origin !== 'server')\n            socket.emit('message', envelope, function () {\n                //console.log('message acknowledged');\n            });\n    },\n\n    join: function(channel) {\n        if (!socket) hub.connect();\n        socket.emit('join', channel);\n    },\n\n    startActor: function(path, id, data) {\n        if (!socket) hub.connect();\n        socket.emit('startActor', { path: path, id: id, data: data });\n    }\n};\n//@ sourceURL=http://tribe//client/hub.js\n", arguments, window, require, module, exports);
(function () {var pubsub = require('tribe.pubsub'),
    socket;

var hub = module.exports = {
    connect: function () {
        socket = io.connect();

        socket.on('message', function (envelope) {
            envelope.origin = 'server';
            pubsub.publish(envelope);
        });
    },

    publish: function(envelope) {
        if (!socket) hub.connect();

        if(envelope.origin !== 'server')
            socket.emit('message', envelope, function () {
                //console.log('message acknowledged');
            });
    },

    join: function(channel) {
        if (!socket) hub.connect();
        socket.emit('join', channel);
    },

    startActor: function(path, id, data) {
        if (!socket) hub.connect();
        socket.emit('startActor', { path: path, id: id, data: data });
    }
};})
},{"tribe.pubsub":104,"tribe/client/enhancedDebug":97}],"truKqQ":[function(require,module,exports){
require("tribe/client/enhancedDebug").execute("// composite has a logger packaged, but use the node version as it will likely get updated\nT.logger = require('tribe/logger');\nrequire('./Pubsub.extensions');\nrequire('./Pubsub.overrides');\n\nmodule.exports = {\n    // client\n    hub: require('tribe/client/hub'),\n    services: require('tribe/client/services'),\n\n    //common\n    pubsub: require('tribe.pubsub'),\n    register: require('tribe/client/register')\n};\n//@ sourceURL=http://tribe//client/index.js\n", arguments, window, require, module, exports);
(function () {// composite has a logger packaged, but use the node version as it will likely get updated
T.logger = require('tribe/logger');
require('./Pubsub.extensions');
require('./Pubsub.overrides');

module.exports = {
    // client
    hub: require('tribe/client/hub'),
    services: require('tribe/client/services'),

    //common
    pubsub: require('tribe.pubsub'),
    register: require('tribe/client/register')
};})
},{"./Pubsub.extensions":21,"./Pubsub.overrides":22,"tribe.pubsub":104,"tribe/client/enhancedDebug":97,"tribe/client/hub":98,"tribe/client/register":99,"tribe/client/services":100,"tribe/logger":101}],"tribe":[function(require,module,exports){
module.exports=require('truKqQ');
},{}],26:[function(require,module,exports){
require("tribe/client/enhancedDebug").execute("/*!\n * The buffer module from node.js, for the browser.\n *\n * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>\n * @license  MIT\n */\n\nvar base64 = require('base64-js')\nvar ieee754 = require('ieee754')\n\nexports.Buffer = Buffer\nexports.SlowBuffer = Buffer\nexports.INSPECT_MAX_BYTES = 50\nBuffer.poolSize = 8192\n\n/**\n * If `Buffer._useTypedArrays`:\n *   === true    Use Uint8Array implementation (fastest)\n *   === false   Use Object implementation (compatible down to IE6)\n */\nBuffer._useTypedArrays = (function () {\n  // Detect if browser supports Typed Arrays. Supported browsers are IE 10+, Firefox 4+,\n  // Chrome 7+, Safari 5.1+, Opera 11.6+, iOS 4.2+. If the browser does not support adding\n  // properties to `Uint8Array` instances, then that's the same as no `Uint8Array` support\n  // because we need to be able to add all the node Buffer API methods. This is an issue\n  // in Firefox 4-29. Now fixed: https://bugzilla.mozilla.org/show_bug.cgi?id=695438\n  try {\n    var buf = new ArrayBuffer(0)\n    var arr = new Uint8Array(buf)\n    arr.foo = function () { return 42 }\n    return 42 === arr.foo() &&\n        typeof arr.subarray === 'function' // Chrome 9-10 lack `subarray`\n  } catch (e) {\n    return false\n  }\n})()\n\n/**\n * Class: Buffer\n * =============\n *\n * The Buffer constructor returns instances of `Uint8Array` that are augmented\n * with function properties for all the node `Buffer` API functions. We use\n * `Uint8Array` so that square bracket notation works as expected -- it returns\n * a single octet.\n *\n * By augmenting the instances, we can avoid modifying the `Uint8Array`\n * prototype.\n */\nfunction Buffer (subject, encoding, noZero) {\n  if (!(this instanceof Buffer))\n    return new Buffer(subject, encoding, noZero)\n\n  var type = typeof subject\n\n  // Workaround: node's base64 implementation allows for non-padded strings\n  // while base64-js does not.\n  if (encoding === 'base64' && type === 'string') {\n    subject = stringtrim(subject)\n    while (subject.length % 4 !== 0) {\n      subject = subject + '='\n    }\n  }\n\n  // Find the length\n  var length\n  if (type === 'number')\n    length = coerce(subject)\n  else if (type === 'string')\n    length = Buffer.byteLength(subject, encoding)\n  else if (type === 'object')\n    length = coerce(subject.length) // assume that object is array-like\n  else\n    throw new Error('First argument needs to be a number, array or string.')\n\n  var buf\n  if (Buffer._useTypedArrays) {\n    // Preferred: Return an augmented `Uint8Array` instance for best performance\n    buf = Buffer._augment(new Uint8Array(length))\n  } else {\n    // Fallback: Return THIS instance of Buffer (created by `new`)\n    buf = this\n    buf.length = length\n    buf._isBuffer = true\n  }\n\n  var i\n  if (Buffer._useTypedArrays && typeof subject.byteLength === 'number') {\n    // Speed optimization -- use set if we're copying from a typed array\n    buf._set(subject)\n  } else if (isArrayish(subject)) {\n    // Treat array-ish objects as a byte array\n    for (i = 0; i < length; i++) {\n      if (Buffer.isBuffer(subject))\n        buf[i] = subject.readUInt8(i)\n      else\n        buf[i] = subject[i]\n    }\n  } else if (type === 'string') {\n    buf.write(subject, 0, encoding)\n  } else if (type === 'number' && !Buffer._useTypedArrays && !noZero) {\n    for (i = 0; i < length; i++) {\n      buf[i] = 0\n    }\n  }\n\n  return buf\n}\n\n// STATIC METHODS\n// ==============\n\nBuffer.isEncoding = function (encoding) {\n  switch (String(encoding).toLowerCase()) {\n    case 'hex':\n    case 'utf8':\n    case 'utf-8':\n    case 'ascii':\n    case 'binary':\n    case 'base64':\n    case 'raw':\n    case 'ucs2':\n    case 'ucs-2':\n    case 'utf16le':\n    case 'utf-16le':\n      return true\n    default:\n      return false\n  }\n}\n\nBuffer.isBuffer = function (b) {\n  return !!(b !== null && b !== undefined && b._isBuffer)\n}\n\nBuffer.byteLength = function (str, encoding) {\n  var ret\n  str = str + ''\n  switch (encoding || 'utf8') {\n    case 'hex':\n      ret = str.length / 2\n      break\n    case 'utf8':\n    case 'utf-8':\n      ret = utf8ToBytes(str).length\n      break\n    case 'ascii':\n    case 'binary':\n    case 'raw':\n      ret = str.length\n      break\n    case 'base64':\n      ret = base64ToBytes(str).length\n      break\n    case 'ucs2':\n    case 'ucs-2':\n    case 'utf16le':\n    case 'utf-16le':\n      ret = str.length * 2\n      break\n    default:\n      throw new Error('Unknown encoding')\n  }\n  return ret\n}\n\nBuffer.concat = function (list, totalLength) {\n  assert(isArray(list), 'Usage: Buffer.concat(list, [totalLength])\\n' +\n      'list should be an Array.')\n\n  if (list.length === 0) {\n    return new Buffer(0)\n  } else if (list.length === 1) {\n    return list[0]\n  }\n\n  var i\n  if (typeof totalLength !== 'number') {\n    totalLength = 0\n    for (i = 0; i < list.length; i++) {\n      totalLength += list[i].length\n    }\n  }\n\n  var buf = new Buffer(totalLength)\n  var pos = 0\n  for (i = 0; i < list.length; i++) {\n    var item = list[i]\n    item.copy(buf, pos)\n    pos += item.length\n  }\n  return buf\n}\n\n// BUFFER INSTANCE METHODS\n// =======================\n\nfunction _hexWrite (buf, string, offset, length) {\n  offset = Number(offset) || 0\n  var remaining = buf.length - offset\n  if (!length) {\n    length = remaining\n  } else {\n    length = Number(length)\n    if (length > remaining) {\n      length = remaining\n    }\n  }\n\n  // must be an even number of digits\n  var strLen = string.length\n  assert(strLen % 2 === 0, 'Invalid hex string')\n\n  if (length > strLen / 2) {\n    length = strLen / 2\n  }\n  for (var i = 0; i < length; i++) {\n    var byte = parseInt(string.substr(i * 2, 2), 16)\n    assert(!isNaN(byte), 'Invalid hex string')\n    buf[offset + i] = byte\n  }\n  Buffer._charsWritten = i * 2\n  return i\n}\n\nfunction _utf8Write (buf, string, offset, length) {\n  var charsWritten = Buffer._charsWritten =\n    blitBuffer(utf8ToBytes(string), buf, offset, length)\n  return charsWritten\n}\n\nfunction _asciiWrite (buf, string, offset, length) {\n  var charsWritten = Buffer._charsWritten =\n    blitBuffer(asciiToBytes(string), buf, offset, length)\n  return charsWritten\n}\n\nfunction _binaryWrite (buf, string, offset, length) {\n  return _asciiWrite(buf, string, offset, length)\n}\n\nfunction _base64Write (buf, string, offset, length) {\n  var charsWritten = Buffer._charsWritten =\n    blitBuffer(base64ToBytes(string), buf, offset, length)\n  return charsWritten\n}\n\nfunction _utf16leWrite (buf, string, offset, length) {\n  var charsWritten = Buffer._charsWritten =\n    blitBuffer(utf16leToBytes(string), buf, offset, length)\n  return charsWritten\n}\n\nBuffer.prototype.write = function (string, offset, length, encoding) {\n  // Support both (string, offset, length, encoding)\n  // and the legacy (string, encoding, offset, length)\n  if (isFinite(offset)) {\n    if (!isFinite(length)) {\n      encoding = length\n      length = undefined\n    }\n  } else {  // legacy\n    var swap = encoding\n    encoding = offset\n    offset = length\n    length = swap\n  }\n\n  offset = Number(offset) || 0\n  var remaining = this.length - offset\n  if (!length) {\n    length = remaining\n  } else {\n    length = Number(length)\n    if (length > remaining) {\n      length = remaining\n    }\n  }\n  encoding = String(encoding || 'utf8').toLowerCase()\n\n  var ret\n  switch (encoding) {\n    case 'hex':\n      ret = _hexWrite(this, string, offset, length)\n      break\n    case 'utf8':\n    case 'utf-8':\n      ret = _utf8Write(this, string, offset, length)\n      break\n    case 'ascii':\n      ret = _asciiWrite(this, string, offset, length)\n      break\n    case 'binary':\n      ret = _binaryWrite(this, string, offset, length)\n      break\n    case 'base64':\n      ret = _base64Write(this, string, offset, length)\n      break\n    case 'ucs2':\n    case 'ucs-2':\n    case 'utf16le':\n    case 'utf-16le':\n      ret = _utf16leWrite(this, string, offset, length)\n      break\n    default:\n      throw new Error('Unknown encoding')\n  }\n  return ret\n}\n\nBuffer.prototype.toString = function (encoding, start, end) {\n  var self = this\n\n  encoding = String(encoding || 'utf8').toLowerCase()\n  start = Number(start) || 0\n  end = (end !== undefined)\n    ? Number(end)\n    : end = self.length\n\n  // Fastpath empty strings\n  if (end === start)\n    return ''\n\n  var ret\n  switch (encoding) {\n    case 'hex':\n      ret = _hexSlice(self, start, end)\n      break\n    case 'utf8':\n    case 'utf-8':\n      ret = _utf8Slice(self, start, end)\n      break\n    case 'ascii':\n      ret = _asciiSlice(self, start, end)\n      break\n    case 'binary':\n      ret = _binarySlice(self, start, end)\n      break\n    case 'base64':\n      ret = _base64Slice(self, start, end)\n      break\n    case 'ucs2':\n    case 'ucs-2':\n    case 'utf16le':\n    case 'utf-16le':\n      ret = _utf16leSlice(self, start, end)\n      break\n    default:\n      throw new Error('Unknown encoding')\n  }\n  return ret\n}\n\nBuffer.prototype.toJSON = function () {\n  return {\n    type: 'Buffer',\n    data: Array.prototype.slice.call(this._arr || this, 0)\n  }\n}\n\n// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)\nBuffer.prototype.copy = function (target, target_start, start, end) {\n  var source = this\n\n  if (!start) start = 0\n  if (!end && end !== 0) end = this.length\n  if (!target_start) target_start = 0\n\n  // Copy 0 bytes; we're done\n  if (end === start) return\n  if (target.length === 0 || source.length === 0) return\n\n  // Fatal error conditions\n  assert(end >= start, 'sourceEnd < sourceStart')\n  assert(target_start >= 0 && target_start < target.length,\n      'targetStart out of bounds')\n  assert(start >= 0 && start < source.length, 'sourceStart out of bounds')\n  assert(end >= 0 && end <= source.length, 'sourceEnd out of bounds')\n\n  // Are we oob?\n  if (end > this.length)\n    end = this.length\n  if (target.length - target_start < end - start)\n    end = target.length - target_start + start\n\n  var len = end - start\n\n  if (len < 100 || !Buffer._useTypedArrays) {\n    for (var i = 0; i < len; i++)\n      target[i + target_start] = this[i + start]\n  } else {\n    target._set(this.subarray(start, start + len), target_start)\n  }\n}\n\nfunction _base64Slice (buf, start, end) {\n  if (start === 0 && end === buf.length) {\n    return base64.fromByteArray(buf)\n  } else {\n    return base64.fromByteArray(buf.slice(start, end))\n  }\n}\n\nfunction _utf8Slice (buf, start, end) {\n  var res = ''\n  var tmp = ''\n  end = Math.min(buf.length, end)\n\n  for (var i = start; i < end; i++) {\n    if (buf[i] <= 0x7F) {\n      res += decodeUtf8Char(tmp) + String.fromCharCode(buf[i])\n      tmp = ''\n    } else {\n      tmp += '%' + buf[i].toString(16)\n    }\n  }\n\n  return res + decodeUtf8Char(tmp)\n}\n\nfunction _asciiSlice (buf, start, end) {\n  var ret = ''\n  end = Math.min(buf.length, end)\n\n  for (var i = start; i < end; i++)\n    ret += String.fromCharCode(buf[i])\n  return ret\n}\n\nfunction _binarySlice (buf, start, end) {\n  return _asciiSlice(buf, start, end)\n}\n\nfunction _hexSlice (buf, start, end) {\n  var len = buf.length\n\n  if (!start || start < 0) start = 0\n  if (!end || end < 0 || end > len) end = len\n\n  var out = ''\n  for (var i = start; i < end; i++) {\n    out += toHex(buf[i])\n  }\n  return out\n}\n\nfunction _utf16leSlice (buf, start, end) {\n  var bytes = buf.slice(start, end)\n  var res = ''\n  for (var i = 0; i < bytes.length; i += 2) {\n    res += String.fromCharCode(bytes[i] + bytes[i+1] * 256)\n  }\n  return res\n}\n\nBuffer.prototype.slice = function (start, end) {\n  var len = this.length\n  start = clamp(start, len, 0)\n  end = clamp(end, len, len)\n\n  if (Buffer._useTypedArrays) {\n    return Buffer._augment(this.subarray(start, end))\n  } else {\n    var sliceLen = end - start\n    var newBuf = new Buffer(sliceLen, undefined, true)\n    for (var i = 0; i < sliceLen; i++) {\n      newBuf[i] = this[i + start]\n    }\n    return newBuf\n  }\n}\n\n// `get` will be removed in Node 0.13+\nBuffer.prototype.get = function (offset) {\n  console.log('.get() is deprecated. Access using array indexes instead.')\n  return this.readUInt8(offset)\n}\n\n// `set` will be removed in Node 0.13+\nBuffer.prototype.set = function (v, offset) {\n  console.log('.set() is deprecated. Access using array indexes instead.')\n  return this.writeUInt8(v, offset)\n}\n\nBuffer.prototype.readUInt8 = function (offset, noAssert) {\n  if (!noAssert) {\n    assert(offset !== undefined && offset !== null, 'missing offset')\n    assert(offset < this.length, 'Trying to read beyond buffer length')\n  }\n\n  if (offset >= this.length)\n    return\n\n  return this[offset]\n}\n\nfunction _readUInt16 (buf, offset, littleEndian, noAssert) {\n  if (!noAssert) {\n    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')\n    assert(offset !== undefined && offset !== null, 'missing offset')\n    assert(offset + 1 < buf.length, 'Trying to read beyond buffer length')\n  }\n\n  var len = buf.length\n  if (offset >= len)\n    return\n\n  var val\n  if (littleEndian) {\n    val = buf[offset]\n    if (offset + 1 < len)\n      val |= buf[offset + 1] << 8\n  } else {\n    val = buf[offset] << 8\n    if (offset + 1 < len)\n      val |= buf[offset + 1]\n  }\n  return val\n}\n\nBuffer.prototype.readUInt16LE = function (offset, noAssert) {\n  return _readUInt16(this, offset, true, noAssert)\n}\n\nBuffer.prototype.readUInt16BE = function (offset, noAssert) {\n  return _readUInt16(this, offset, false, noAssert)\n}\n\nfunction _readUInt32 (buf, offset, littleEndian, noAssert) {\n  if (!noAssert) {\n    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')\n    assert(offset !== undefined && offset !== null, 'missing offset')\n    assert(offset + 3 < buf.length, 'Trying to read beyond buffer length')\n  }\n\n  var len = buf.length\n  if (offset >= len)\n    return\n\n  var val\n  if (littleEndian) {\n    if (offset + 2 < len)\n      val = buf[offset + 2] << 16\n    if (offset + 1 < len)\n      val |= buf[offset + 1] << 8\n    val |= buf[offset]\n    if (offset + 3 < len)\n      val = val + (buf[offset + 3] << 24 >>> 0)\n  } else {\n    if (offset + 1 < len)\n      val = buf[offset + 1] << 16\n    if (offset + 2 < len)\n      val |= buf[offset + 2] << 8\n    if (offset + 3 < len)\n      val |= buf[offset + 3]\n    val = val + (buf[offset] << 24 >>> 0)\n  }\n  return val\n}\n\nBuffer.prototype.readUInt32LE = function (offset, noAssert) {\n  return _readUInt32(this, offset, true, noAssert)\n}\n\nBuffer.prototype.readUInt32BE = function (offset, noAssert) {\n  return _readUInt32(this, offset, false, noAssert)\n}\n\nBuffer.prototype.readInt8 = function (offset, noAssert) {\n  if (!noAssert) {\n    assert(offset !== undefined && offset !== null,\n        'missing offset')\n    assert(offset < this.length, 'Trying to read beyond buffer length')\n  }\n\n  if (offset >= this.length)\n    return\n\n  var neg = this[offset] & 0x80\n  if (neg)\n    return (0xff - this[offset] + 1) * -1\n  else\n    return this[offset]\n}\n\nfunction _readInt16 (buf, offset, littleEndian, noAssert) {\n  if (!noAssert) {\n    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')\n    assert(offset !== undefined && offset !== null, 'missing offset')\n    assert(offset + 1 < buf.length, 'Trying to read beyond buffer length')\n  }\n\n  var len = buf.length\n  if (offset >= len)\n    return\n\n  var val = _readUInt16(buf, offset, littleEndian, true)\n  var neg = val & 0x8000\n  if (neg)\n    return (0xffff - val + 1) * -1\n  else\n    return val\n}\n\nBuffer.prototype.readInt16LE = function (offset, noAssert) {\n  return _readInt16(this, offset, true, noAssert)\n}\n\nBuffer.prototype.readInt16BE = function (offset, noAssert) {\n  return _readInt16(this, offset, false, noAssert)\n}\n\nfunction _readInt32 (buf, offset, littleEndian, noAssert) {\n  if (!noAssert) {\n    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')\n    assert(offset !== undefined && offset !== null, 'missing offset')\n    assert(offset + 3 < buf.length, 'Trying to read beyond buffer length')\n  }\n\n  var len = buf.length\n  if (offset >= len)\n    return\n\n  var val = _readUInt32(buf, offset, littleEndian, true)\n  var neg = val & 0x80000000\n  if (neg)\n    return (0xffffffff - val + 1) * -1\n  else\n    return val\n}\n\nBuffer.prototype.readInt32LE = function (offset, noAssert) {\n  return _readInt32(this, offset, true, noAssert)\n}\n\nBuffer.prototype.readInt32BE = function (offset, noAssert) {\n  return _readInt32(this, offset, false, noAssert)\n}\n\nfunction _readFloat (buf, offset, littleEndian, noAssert) {\n  if (!noAssert) {\n    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')\n    assert(offset + 3 < buf.length, 'Trying to read beyond buffer length')\n  }\n\n  return ieee754.read(buf, offset, littleEndian, 23, 4)\n}\n\nBuffer.prototype.readFloatLE = function (offset, noAssert) {\n  return _readFloat(this, offset, true, noAssert)\n}\n\nBuffer.prototype.readFloatBE = function (offset, noAssert) {\n  return _readFloat(this, offset, false, noAssert)\n}\n\nfunction _readDouble (buf, offset, littleEndian, noAssert) {\n  if (!noAssert) {\n    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')\n    assert(offset + 7 < buf.length, 'Trying to read beyond buffer length')\n  }\n\n  return ieee754.read(buf, offset, littleEndian, 52, 8)\n}\n\nBuffer.prototype.readDoubleLE = function (offset, noAssert) {\n  return _readDouble(this, offset, true, noAssert)\n}\n\nBuffer.prototype.readDoubleBE = function (offset, noAssert) {\n  return _readDouble(this, offset, false, noAssert)\n}\n\nBuffer.prototype.writeUInt8 = function (value, offset, noAssert) {\n  if (!noAssert) {\n    assert(value !== undefined && value !== null, 'missing value')\n    assert(offset !== undefined && offset !== null, 'missing offset')\n    assert(offset < this.length, 'trying to write beyond buffer length')\n    verifuint(value, 0xff)\n  }\n\n  if (offset >= this.length) return\n\n  this[offset] = value\n}\n\nfunction _writeUInt16 (buf, value, offset, littleEndian, noAssert) {\n  if (!noAssert) {\n    assert(value !== undefined && value !== null, 'missing value')\n    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')\n    assert(offset !== undefined && offset !== null, 'missing offset')\n    assert(offset + 1 < buf.length, 'trying to write beyond buffer length')\n    verifuint(value, 0xffff)\n  }\n\n  var len = buf.length\n  if (offset >= len)\n    return\n\n  for (var i = 0, j = Math.min(len - offset, 2); i < j; i++) {\n    buf[offset + i] =\n        (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>\n            (littleEndian ? i : 1 - i) * 8\n  }\n}\n\nBuffer.prototype.writeUInt16LE = function (value, offset, noAssert) {\n  _writeUInt16(this, value, offset, true, noAssert)\n}\n\nBuffer.prototype.writeUInt16BE = function (value, offset, noAssert) {\n  _writeUInt16(this, value, offset, false, noAssert)\n}\n\nfunction _writeUInt32 (buf, value, offset, littleEndian, noAssert) {\n  if (!noAssert) {\n    assert(value !== undefined && value !== null, 'missing value')\n    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')\n    assert(offset !== undefined && offset !== null, 'missing offset')\n    assert(offset + 3 < buf.length, 'trying to write beyond buffer length')\n    verifuint(value, 0xffffffff)\n  }\n\n  var len = buf.length\n  if (offset >= len)\n    return\n\n  for (var i = 0, j = Math.min(len - offset, 4); i < j; i++) {\n    buf[offset + i] =\n        (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff\n  }\n}\n\nBuffer.prototype.writeUInt32LE = function (value, offset, noAssert) {\n  _writeUInt32(this, value, offset, true, noAssert)\n}\n\nBuffer.prototype.writeUInt32BE = function (value, offset, noAssert) {\n  _writeUInt32(this, value, offset, false, noAssert)\n}\n\nBuffer.prototype.writeInt8 = function (value, offset, noAssert) {\n  if (!noAssert) {\n    assert(value !== undefined && value !== null, 'missing value')\n    assert(offset !== undefined && offset !== null, 'missing offset')\n    assert(offset < this.length, 'Trying to write beyond buffer length')\n    verifsint(value, 0x7f, -0x80)\n  }\n\n  if (offset >= this.length)\n    return\n\n  if (value >= 0)\n    this.writeUInt8(value, offset, noAssert)\n  else\n    this.writeUInt8(0xff + value + 1, offset, noAssert)\n}\n\nfunction _writeInt16 (buf, value, offset, littleEndian, noAssert) {\n  if (!noAssert) {\n    assert(value !== undefined && value !== null, 'missing value')\n    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')\n    assert(offset !== undefined && offset !== null, 'missing offset')\n    assert(offset + 1 < buf.length, 'Trying to write beyond buffer length')\n    verifsint(value, 0x7fff, -0x8000)\n  }\n\n  var len = buf.length\n  if (offset >= len)\n    return\n\n  if (value >= 0)\n    _writeUInt16(buf, value, offset, littleEndian, noAssert)\n  else\n    _writeUInt16(buf, 0xffff + value + 1, offset, littleEndian, noAssert)\n}\n\nBuffer.prototype.writeInt16LE = function (value, offset, noAssert) {\n  _writeInt16(this, value, offset, true, noAssert)\n}\n\nBuffer.prototype.writeInt16BE = function (value, offset, noAssert) {\n  _writeInt16(this, value, offset, false, noAssert)\n}\n\nfunction _writeInt32 (buf, value, offset, littleEndian, noAssert) {\n  if (!noAssert) {\n    assert(value !== undefined && value !== null, 'missing value')\n    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')\n    assert(offset !== undefined && offset !== null, 'missing offset')\n    assert(offset + 3 < buf.length, 'Trying to write beyond buffer length')\n    verifsint(value, 0x7fffffff, -0x80000000)\n  }\n\n  var len = buf.length\n  if (offset >= len)\n    return\n\n  if (value >= 0)\n    _writeUInt32(buf, value, offset, littleEndian, noAssert)\n  else\n    _writeUInt32(buf, 0xffffffff + value + 1, offset, littleEndian, noAssert)\n}\n\nBuffer.prototype.writeInt32LE = function (value, offset, noAssert) {\n  _writeInt32(this, value, offset, true, noAssert)\n}\n\nBuffer.prototype.writeInt32BE = function (value, offset, noAssert) {\n  _writeInt32(this, value, offset, false, noAssert)\n}\n\nfunction _writeFloat (buf, value, offset, littleEndian, noAssert) {\n  if (!noAssert) {\n    assert(value !== undefined && value !== null, 'missing value')\n    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')\n    assert(offset !== undefined && offset !== null, 'missing offset')\n    assert(offset + 3 < buf.length, 'Trying to write beyond buffer length')\n    verifIEEE754(value, 3.4028234663852886e+38, -3.4028234663852886e+38)\n  }\n\n  var len = buf.length\n  if (offset >= len)\n    return\n\n  ieee754.write(buf, value, offset, littleEndian, 23, 4)\n}\n\nBuffer.prototype.writeFloatLE = function (value, offset, noAssert) {\n  _writeFloat(this, value, offset, true, noAssert)\n}\n\nBuffer.prototype.writeFloatBE = function (value, offset, noAssert) {\n  _writeFloat(this, value, offset, false, noAssert)\n}\n\nfunction _writeDouble (buf, value, offset, littleEndian, noAssert) {\n  if (!noAssert) {\n    assert(value !== undefined && value !== null, 'missing value')\n    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')\n    assert(offset !== undefined && offset !== null, 'missing offset')\n    assert(offset + 7 < buf.length,\n        'Trying to write beyond buffer length')\n    verifIEEE754(value, 1.7976931348623157E+308, -1.7976931348623157E+308)\n  }\n\n  var len = buf.length\n  if (offset >= len)\n    return\n\n  ieee754.write(buf, value, offset, littleEndian, 52, 8)\n}\n\nBuffer.prototype.writeDoubleLE = function (value, offset, noAssert) {\n  _writeDouble(this, value, offset, true, noAssert)\n}\n\nBuffer.prototype.writeDoubleBE = function (value, offset, noAssert) {\n  _writeDouble(this, value, offset, false, noAssert)\n}\n\n// fill(value, start=0, end=buffer.length)\nBuffer.prototype.fill = function (value, start, end) {\n  if (!value) value = 0\n  if (!start) start = 0\n  if (!end) end = this.length\n\n  if (typeof value === 'string') {\n    value = value.charCodeAt(0)\n  }\n\n  assert(typeof value === 'number' && !isNaN(value), 'value is not a number')\n  assert(end >= start, 'end < start')\n\n  // Fill 0 bytes; we're done\n  if (end === start) return\n  if (this.length === 0) return\n\n  assert(start >= 0 && start < this.length, 'start out of bounds')\n  assert(end >= 0 && end <= this.length, 'end out of bounds')\n\n  for (var i = start; i < end; i++) {\n    this[i] = value\n  }\n}\n\nBuffer.prototype.inspect = function () {\n  var out = []\n  var len = this.length\n  for (var i = 0; i < len; i++) {\n    out[i] = toHex(this[i])\n    if (i === exports.INSPECT_MAX_BYTES) {\n      out[i + 1] = '...'\n      break\n    }\n  }\n  return '<Buffer ' + out.join(' ') + '>'\n}\n\n/**\n * Creates a new `ArrayBuffer` with the *copied* memory of the buffer instance.\n * Added in Node 0.12. Only available in browsers that support ArrayBuffer.\n */\nBuffer.prototype.toArrayBuffer = function () {\n  if (typeof Uint8Array !== 'undefined') {\n    if (Buffer._useTypedArrays) {\n      return (new Buffer(this)).buffer\n    } else {\n      var buf = new Uint8Array(this.length)\n      for (var i = 0, len = buf.length; i < len; i += 1)\n        buf[i] = this[i]\n      return buf.buffer\n    }\n  } else {\n    throw new Error('Buffer.toArrayBuffer not supported in this browser')\n  }\n}\n\n// HELPER FUNCTIONS\n// ================\n\nfunction stringtrim (str) {\n  if (str.trim) return str.trim()\n  return str.replace(/^\\s+|\\s+$/g, '')\n}\n\nvar BP = Buffer.prototype\n\n/**\n * Augment a Uint8Array *instance* (not the Uint8Array class!) with Buffer methods\n */\nBuffer._augment = function (arr) {\n  arr._isBuffer = true\n\n  // save reference to original Uint8Array get/set methods before overwriting\n  arr._get = arr.get\n  arr._set = arr.set\n\n  // deprecated, will be removed in node 0.13+\n  arr.get = BP.get\n  arr.set = BP.set\n\n  arr.write = BP.write\n  arr.toString = BP.toString\n  arr.toLocaleString = BP.toString\n  arr.toJSON = BP.toJSON\n  arr.copy = BP.copy\n  arr.slice = BP.slice\n  arr.readUInt8 = BP.readUInt8\n  arr.readUInt16LE = BP.readUInt16LE\n  arr.readUInt16BE = BP.readUInt16BE\n  arr.readUInt32LE = BP.readUInt32LE\n  arr.readUInt32BE = BP.readUInt32BE\n  arr.readInt8 = BP.readInt8\n  arr.readInt16LE = BP.readInt16LE\n  arr.readInt16BE = BP.readInt16BE\n  arr.readInt32LE = BP.readInt32LE\n  arr.readInt32BE = BP.readInt32BE\n  arr.readFloatLE = BP.readFloatLE\n  arr.readFloatBE = BP.readFloatBE\n  arr.readDoubleLE = BP.readDoubleLE\n  arr.readDoubleBE = BP.readDoubleBE\n  arr.writeUInt8 = BP.writeUInt8\n  arr.writeUInt16LE = BP.writeUInt16LE\n  arr.writeUInt16BE = BP.writeUInt16BE\n  arr.writeUInt32LE = BP.writeUInt32LE\n  arr.writeUInt32BE = BP.writeUInt32BE\n  arr.writeInt8 = BP.writeInt8\n  arr.writeInt16LE = BP.writeInt16LE\n  arr.writeInt16BE = BP.writeInt16BE\n  arr.writeInt32LE = BP.writeInt32LE\n  arr.writeInt32BE = BP.writeInt32BE\n  arr.writeFloatLE = BP.writeFloatLE\n  arr.writeFloatBE = BP.writeFloatBE\n  arr.writeDoubleLE = BP.writeDoubleLE\n  arr.writeDoubleBE = BP.writeDoubleBE\n  arr.fill = BP.fill\n  arr.inspect = BP.inspect\n  arr.toArrayBuffer = BP.toArrayBuffer\n\n  return arr\n}\n\n// slice(start, end)\nfunction clamp (index, len, defaultValue) {\n  if (typeof index !== 'number') return defaultValue\n  index = ~~index;  // Coerce to integer.\n  if (index >= len) return len\n  if (index >= 0) return index\n  index += len\n  if (index >= 0) return index\n  return 0\n}\n\nfunction coerce (length) {\n  // Coerce length to a number (possibly NaN), round up\n  // in case it's fractional (e.g. 123.456) then do a\n  // double negate to coerce a NaN to 0. Easy, right?\n  length = ~~Math.ceil(+length)\n  return length < 0 ? 0 : length\n}\n\nfunction isArray (subject) {\n  return (Array.isArray || function (subject) {\n    return Object.prototype.toString.call(subject) === '[object Array]'\n  })(subject)\n}\n\nfunction isArrayish (subject) {\n  return isArray(subject) || Buffer.isBuffer(subject) ||\n      subject && typeof subject === 'object' &&\n      typeof subject.length === 'number'\n}\n\nfunction toHex (n) {\n  if (n < 16) return '0' + n.toString(16)\n  return n.toString(16)\n}\n\nfunction utf8ToBytes (str) {\n  var byteArray = []\n  for (var i = 0; i < str.length; i++) {\n    var b = str.charCodeAt(i)\n    if (b <= 0x7F)\n      byteArray.push(str.charCodeAt(i))\n    else {\n      var start = i\n      if (b >= 0xD800 && b <= 0xDFFF) i++\n      var h = encodeURIComponent(str.slice(start, i+1)).substr(1).split('%')\n      for (var j = 0; j < h.length; j++)\n        byteArray.push(parseInt(h[j], 16))\n    }\n  }\n  return byteArray\n}\n\nfunction asciiToBytes (str) {\n  var byteArray = []\n  for (var i = 0; i < str.length; i++) {\n    // Node's code seems to be doing this and not & 0x7F..\n    byteArray.push(str.charCodeAt(i) & 0xFF)\n  }\n  return byteArray\n}\n\nfunction utf16leToBytes (str) {\n  var c, hi, lo\n  var byteArray = []\n  for (var i = 0; i < str.length; i++) {\n    c = str.charCodeAt(i)\n    hi = c >> 8\n    lo = c % 256\n    byteArray.push(lo)\n    byteArray.push(hi)\n  }\n\n  return byteArray\n}\n\nfunction base64ToBytes (str) {\n  return base64.toByteArray(str)\n}\n\nfunction blitBuffer (src, dst, offset, length) {\n  var pos\n  for (var i = 0; i < length; i++) {\n    if ((i + offset >= dst.length) || (i >= src.length))\n      break\n    dst[i + offset] = src[i]\n  }\n  return i\n}\n\nfunction decodeUtf8Char (str) {\n  try {\n    return decodeURIComponent(str)\n  } catch (err) {\n    return String.fromCharCode(0xFFFD) // UTF 8 invalid char\n  }\n}\n\n/*\n * We have to make sure that the value is a valid integer. This means that it\n * is non-negative. It has no fractional component and that it does not\n * exceed the maximum allowed value.\n */\nfunction verifuint (value, max) {\n  assert(typeof value === 'number', 'cannot write a non-number as a number')\n  assert(value >= 0, 'specified a negative value for writing an unsigned value')\n  assert(value <= max, 'value is larger than maximum value for type')\n  assert(Math.floor(value) === value, 'value has a fractional component')\n}\n\nfunction verifsint (value, max, min) {\n  assert(typeof value === 'number', 'cannot write a non-number as a number')\n  assert(value <= max, 'value larger than maximum allowed value')\n  assert(value >= min, 'value smaller than minimum allowed value')\n  assert(Math.floor(value) === value, 'value has a fractional component')\n}\n\nfunction verifIEEE754 (value, max, min) {\n  assert(typeof value === 'number', 'cannot write a non-number as a number')\n  assert(value <= max, 'value larger than maximum allowed value')\n  assert(value >= min, 'value smaller than minimum allowed value')\n}\n\nfunction assert (test, message) {\n  if (!test) throw new Error(message || 'Failed assertion')\n}\n\n//@ sourceURL=http://tribe//node_modules/browserify/node_modules/buffer/index.js\n", arguments, window, require, module, exports);
(function () {/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */

var base64 = require('base64-js')
var ieee754 = require('ieee754')

exports.Buffer = Buffer
exports.SlowBuffer = Buffer
exports.INSPECT_MAX_BYTES = 50
Buffer.poolSize = 8192

/**
 * If `Buffer._useTypedArrays`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Use Object implementation (compatible down to IE6)
 */
Buffer._useTypedArrays = (function () {
  // Detect if browser supports Typed Arrays. Supported browsers are IE 10+, Firefox 4+,
  // Chrome 7+, Safari 5.1+, Opera 11.6+, iOS 4.2+. If the browser does not support adding
  // properties to `Uint8Array` instances, then that's the same as no `Uint8Array` support
  // because we need to be able to add all the node Buffer API methods. This is an issue
  // in Firefox 4-29. Now fixed: https://bugzilla.mozilla.org/show_bug.cgi?id=695438
  try {
    var buf = new ArrayBuffer(0)
    var arr = new Uint8Array(buf)
    arr.foo = function () { return 42 }
    return 42 === arr.foo() &&
        typeof arr.subarray === 'function' // Chrome 9-10 lack `subarray`
  } catch (e) {
    return false
  }
})()

/**
 * Class: Buffer
 * =============
 *
 * The Buffer constructor returns instances of `Uint8Array` that are augmented
 * with function properties for all the node `Buffer` API functions. We use
 * `Uint8Array` so that square bracket notation works as expected -- it returns
 * a single octet.
 *
 * By augmenting the instances, we can avoid modifying the `Uint8Array`
 * prototype.
 */
function Buffer (subject, encoding, noZero) {
  if (!(this instanceof Buffer))
    return new Buffer(subject, encoding, noZero)

  var type = typeof subject

  // Workaround: node's base64 implementation allows for non-padded strings
  // while base64-js does not.
  if (encoding === 'base64' && type === 'string') {
    subject = stringtrim(subject)
    while (subject.length % 4 !== 0) {
      subject = subject + '='
    }
  }

  // Find the length
  var length
  if (type === 'number')
    length = coerce(subject)
  else if (type === 'string')
    length = Buffer.byteLength(subject, encoding)
  else if (type === 'object')
    length = coerce(subject.length) // assume that object is array-like
  else
    throw new Error('First argument needs to be a number, array or string.')

  var buf
  if (Buffer._useTypedArrays) {
    // Preferred: Return an augmented `Uint8Array` instance for best performance
    buf = Buffer._augment(new Uint8Array(length))
  } else {
    // Fallback: Return THIS instance of Buffer (created by `new`)
    buf = this
    buf.length = length
    buf._isBuffer = true
  }

  var i
  if (Buffer._useTypedArrays && typeof subject.byteLength === 'number') {
    // Speed optimization -- use set if we're copying from a typed array
    buf._set(subject)
  } else if (isArrayish(subject)) {
    // Treat array-ish objects as a byte array
    for (i = 0; i < length; i++) {
      if (Buffer.isBuffer(subject))
        buf[i] = subject.readUInt8(i)
      else
        buf[i] = subject[i]
    }
  } else if (type === 'string') {
    buf.write(subject, 0, encoding)
  } else if (type === 'number' && !Buffer._useTypedArrays && !noZero) {
    for (i = 0; i < length; i++) {
      buf[i] = 0
    }
  }

  return buf
}

// STATIC METHODS
// ==============

Buffer.isEncoding = function (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'binary':
    case 'base64':
    case 'raw':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
}

Buffer.isBuffer = function (b) {
  return !!(b !== null && b !== undefined && b._isBuffer)
}

Buffer.byteLength = function (str, encoding) {
  var ret
  str = str + ''
  switch (encoding || 'utf8') {
    case 'hex':
      ret = str.length / 2
      break
    case 'utf8':
    case 'utf-8':
      ret = utf8ToBytes(str).length
      break
    case 'ascii':
    case 'binary':
    case 'raw':
      ret = str.length
      break
    case 'base64':
      ret = base64ToBytes(str).length
      break
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      ret = str.length * 2
      break
    default:
      throw new Error('Unknown encoding')
  }
  return ret
}

Buffer.concat = function (list, totalLength) {
  assert(isArray(list), 'Usage: Buffer.concat(list, [totalLength])\n' +
      'list should be an Array.')

  if (list.length === 0) {
    return new Buffer(0)
  } else if (list.length === 1) {
    return list[0]
  }

  var i
  if (typeof totalLength !== 'number') {
    totalLength = 0
    for (i = 0; i < list.length; i++) {
      totalLength += list[i].length
    }
  }

  var buf = new Buffer(totalLength)
  var pos = 0
  for (i = 0; i < list.length; i++) {
    var item = list[i]
    item.copy(buf, pos)
    pos += item.length
  }
  return buf
}

// BUFFER INSTANCE METHODS
// =======================

function _hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0
  var remaining = buf.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }

  // must be an even number of digits
  var strLen = string.length
  assert(strLen % 2 === 0, 'Invalid hex string')

  if (length > strLen / 2) {
    length = strLen / 2
  }
  for (var i = 0; i < length; i++) {
    var byte = parseInt(string.substr(i * 2, 2), 16)
    assert(!isNaN(byte), 'Invalid hex string')
    buf[offset + i] = byte
  }
  Buffer._charsWritten = i * 2
  return i
}

function _utf8Write (buf, string, offset, length) {
  var charsWritten = Buffer._charsWritten =
    blitBuffer(utf8ToBytes(string), buf, offset, length)
  return charsWritten
}

function _asciiWrite (buf, string, offset, length) {
  var charsWritten = Buffer._charsWritten =
    blitBuffer(asciiToBytes(string), buf, offset, length)
  return charsWritten
}

function _binaryWrite (buf, string, offset, length) {
  return _asciiWrite(buf, string, offset, length)
}

function _base64Write (buf, string, offset, length) {
  var charsWritten = Buffer._charsWritten =
    blitBuffer(base64ToBytes(string), buf, offset, length)
  return charsWritten
}

function _utf16leWrite (buf, string, offset, length) {
  var charsWritten = Buffer._charsWritten =
    blitBuffer(utf16leToBytes(string), buf, offset, length)
  return charsWritten
}

Buffer.prototype.write = function (string, offset, length, encoding) {
  // Support both (string, offset, length, encoding)
  // and the legacy (string, encoding, offset, length)
  if (isFinite(offset)) {
    if (!isFinite(length)) {
      encoding = length
      length = undefined
    }
  } else {  // legacy
    var swap = encoding
    encoding = offset
    offset = length
    length = swap
  }

  offset = Number(offset) || 0
  var remaining = this.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }
  encoding = String(encoding || 'utf8').toLowerCase()

  var ret
  switch (encoding) {
    case 'hex':
      ret = _hexWrite(this, string, offset, length)
      break
    case 'utf8':
    case 'utf-8':
      ret = _utf8Write(this, string, offset, length)
      break
    case 'ascii':
      ret = _asciiWrite(this, string, offset, length)
      break
    case 'binary':
      ret = _binaryWrite(this, string, offset, length)
      break
    case 'base64':
      ret = _base64Write(this, string, offset, length)
      break
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      ret = _utf16leWrite(this, string, offset, length)
      break
    default:
      throw new Error('Unknown encoding')
  }
  return ret
}

Buffer.prototype.toString = function (encoding, start, end) {
  var self = this

  encoding = String(encoding || 'utf8').toLowerCase()
  start = Number(start) || 0
  end = (end !== undefined)
    ? Number(end)
    : end = self.length

  // Fastpath empty strings
  if (end === start)
    return ''

  var ret
  switch (encoding) {
    case 'hex':
      ret = _hexSlice(self, start, end)
      break
    case 'utf8':
    case 'utf-8':
      ret = _utf8Slice(self, start, end)
      break
    case 'ascii':
      ret = _asciiSlice(self, start, end)
      break
    case 'binary':
      ret = _binarySlice(self, start, end)
      break
    case 'base64':
      ret = _base64Slice(self, start, end)
      break
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      ret = _utf16leSlice(self, start, end)
      break
    default:
      throw new Error('Unknown encoding')
  }
  return ret
}

Buffer.prototype.toJSON = function () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
}

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function (target, target_start, start, end) {
  var source = this

  if (!start) start = 0
  if (!end && end !== 0) end = this.length
  if (!target_start) target_start = 0

  // Copy 0 bytes; we're done
  if (end === start) return
  if (target.length === 0 || source.length === 0) return

  // Fatal error conditions
  assert(end >= start, 'sourceEnd < sourceStart')
  assert(target_start >= 0 && target_start < target.length,
      'targetStart out of bounds')
  assert(start >= 0 && start < source.length, 'sourceStart out of bounds')
  assert(end >= 0 && end <= source.length, 'sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length)
    end = this.length
  if (target.length - target_start < end - start)
    end = target.length - target_start + start

  var len = end - start

  if (len < 100 || !Buffer._useTypedArrays) {
    for (var i = 0; i < len; i++)
      target[i + target_start] = this[i + start]
  } else {
    target._set(this.subarray(start, start + len), target_start)
  }
}

function _base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf)
  } else {
    return base64.fromByteArray(buf.slice(start, end))
  }
}

function _utf8Slice (buf, start, end) {
  var res = ''
  var tmp = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; i++) {
    if (buf[i] <= 0x7F) {
      res += decodeUtf8Char(tmp) + String.fromCharCode(buf[i])
      tmp = ''
    } else {
      tmp += '%' + buf[i].toString(16)
    }
  }

  return res + decodeUtf8Char(tmp)
}

function _asciiSlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; i++)
    ret += String.fromCharCode(buf[i])
  return ret
}

function _binarySlice (buf, start, end) {
  return _asciiSlice(buf, start, end)
}

function _hexSlice (buf, start, end) {
  var len = buf.length

  if (!start || start < 0) start = 0
  if (!end || end < 0 || end > len) end = len

  var out = ''
  for (var i = start; i < end; i++) {
    out += toHex(buf[i])
  }
  return out
}

function _utf16leSlice (buf, start, end) {
  var bytes = buf.slice(start, end)
  var res = ''
  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + bytes[i+1] * 256)
  }
  return res
}

Buffer.prototype.slice = function (start, end) {
  var len = this.length
  start = clamp(start, len, 0)
  end = clamp(end, len, len)

  if (Buffer._useTypedArrays) {
    return Buffer._augment(this.subarray(start, end))
  } else {
    var sliceLen = end - start
    var newBuf = new Buffer(sliceLen, undefined, true)
    for (var i = 0; i < sliceLen; i++) {
      newBuf[i] = this[i + start]
    }
    return newBuf
  }
}

// `get` will be removed in Node 0.13+
Buffer.prototype.get = function (offset) {
  console.log('.get() is deprecated. Access using array indexes instead.')
  return this.readUInt8(offset)
}

// `set` will be removed in Node 0.13+
Buffer.prototype.set = function (v, offset) {
  console.log('.set() is deprecated. Access using array indexes instead.')
  return this.writeUInt8(v, offset)
}

Buffer.prototype.readUInt8 = function (offset, noAssert) {
  if (!noAssert) {
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset < this.length, 'Trying to read beyond buffer length')
  }

  if (offset >= this.length)
    return

  return this[offset]
}

function _readUInt16 (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 1 < buf.length, 'Trying to read beyond buffer length')
  }

  var len = buf.length
  if (offset >= len)
    return

  var val
  if (littleEndian) {
    val = buf[offset]
    if (offset + 1 < len)
      val |= buf[offset + 1] << 8
  } else {
    val = buf[offset] << 8
    if (offset + 1 < len)
      val |= buf[offset + 1]
  }
  return val
}

Buffer.prototype.readUInt16LE = function (offset, noAssert) {
  return _readUInt16(this, offset, true, noAssert)
}

Buffer.prototype.readUInt16BE = function (offset, noAssert) {
  return _readUInt16(this, offset, false, noAssert)
}

function _readUInt32 (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 3 < buf.length, 'Trying to read beyond buffer length')
  }

  var len = buf.length
  if (offset >= len)
    return

  var val
  if (littleEndian) {
    if (offset + 2 < len)
      val = buf[offset + 2] << 16
    if (offset + 1 < len)
      val |= buf[offset + 1] << 8
    val |= buf[offset]
    if (offset + 3 < len)
      val = val + (buf[offset + 3] << 24 >>> 0)
  } else {
    if (offset + 1 < len)
      val = buf[offset + 1] << 16
    if (offset + 2 < len)
      val |= buf[offset + 2] << 8
    if (offset + 3 < len)
      val |= buf[offset + 3]
    val = val + (buf[offset] << 24 >>> 0)
  }
  return val
}

Buffer.prototype.readUInt32LE = function (offset, noAssert) {
  return _readUInt32(this, offset, true, noAssert)
}

Buffer.prototype.readUInt32BE = function (offset, noAssert) {
  return _readUInt32(this, offset, false, noAssert)
}

Buffer.prototype.readInt8 = function (offset, noAssert) {
  if (!noAssert) {
    assert(offset !== undefined && offset !== null,
        'missing offset')
    assert(offset < this.length, 'Trying to read beyond buffer length')
  }

  if (offset >= this.length)
    return

  var neg = this[offset] & 0x80
  if (neg)
    return (0xff - this[offset] + 1) * -1
  else
    return this[offset]
}

function _readInt16 (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 1 < buf.length, 'Trying to read beyond buffer length')
  }

  var len = buf.length
  if (offset >= len)
    return

  var val = _readUInt16(buf, offset, littleEndian, true)
  var neg = val & 0x8000
  if (neg)
    return (0xffff - val + 1) * -1
  else
    return val
}

Buffer.prototype.readInt16LE = function (offset, noAssert) {
  return _readInt16(this, offset, true, noAssert)
}

Buffer.prototype.readInt16BE = function (offset, noAssert) {
  return _readInt16(this, offset, false, noAssert)
}

function _readInt32 (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 3 < buf.length, 'Trying to read beyond buffer length')
  }

  var len = buf.length
  if (offset >= len)
    return

  var val = _readUInt32(buf, offset, littleEndian, true)
  var neg = val & 0x80000000
  if (neg)
    return (0xffffffff - val + 1) * -1
  else
    return val
}

Buffer.prototype.readInt32LE = function (offset, noAssert) {
  return _readInt32(this, offset, true, noAssert)
}

Buffer.prototype.readInt32BE = function (offset, noAssert) {
  return _readInt32(this, offset, false, noAssert)
}

function _readFloat (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset + 3 < buf.length, 'Trying to read beyond buffer length')
  }

  return ieee754.read(buf, offset, littleEndian, 23, 4)
}

Buffer.prototype.readFloatLE = function (offset, noAssert) {
  return _readFloat(this, offset, true, noAssert)
}

Buffer.prototype.readFloatBE = function (offset, noAssert) {
  return _readFloat(this, offset, false, noAssert)
}

function _readDouble (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset + 7 < buf.length, 'Trying to read beyond buffer length')
  }

  return ieee754.read(buf, offset, littleEndian, 52, 8)
}

Buffer.prototype.readDoubleLE = function (offset, noAssert) {
  return _readDouble(this, offset, true, noAssert)
}

Buffer.prototype.readDoubleBE = function (offset, noAssert) {
  return _readDouble(this, offset, false, noAssert)
}

Buffer.prototype.writeUInt8 = function (value, offset, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset < this.length, 'trying to write beyond buffer length')
    verifuint(value, 0xff)
  }

  if (offset >= this.length) return

  this[offset] = value
}

function _writeUInt16 (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 1 < buf.length, 'trying to write beyond buffer length')
    verifuint(value, 0xffff)
  }

  var len = buf.length
  if (offset >= len)
    return

  for (var i = 0, j = Math.min(len - offset, 2); i < j; i++) {
    buf[offset + i] =
        (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
            (littleEndian ? i : 1 - i) * 8
  }
}

Buffer.prototype.writeUInt16LE = function (value, offset, noAssert) {
  _writeUInt16(this, value, offset, true, noAssert)
}

Buffer.prototype.writeUInt16BE = function (value, offset, noAssert) {
  _writeUInt16(this, value, offset, false, noAssert)
}

function _writeUInt32 (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 3 < buf.length, 'trying to write beyond buffer length')
    verifuint(value, 0xffffffff)
  }

  var len = buf.length
  if (offset >= len)
    return

  for (var i = 0, j = Math.min(len - offset, 4); i < j; i++) {
    buf[offset + i] =
        (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff
  }
}

Buffer.prototype.writeUInt32LE = function (value, offset, noAssert) {
  _writeUInt32(this, value, offset, true, noAssert)
}

Buffer.prototype.writeUInt32BE = function (value, offset, noAssert) {
  _writeUInt32(this, value, offset, false, noAssert)
}

Buffer.prototype.writeInt8 = function (value, offset, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset < this.length, 'Trying to write beyond buffer length')
    verifsint(value, 0x7f, -0x80)
  }

  if (offset >= this.length)
    return

  if (value >= 0)
    this.writeUInt8(value, offset, noAssert)
  else
    this.writeUInt8(0xff + value + 1, offset, noAssert)
}

function _writeInt16 (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 1 < buf.length, 'Trying to write beyond buffer length')
    verifsint(value, 0x7fff, -0x8000)
  }

  var len = buf.length
  if (offset >= len)
    return

  if (value >= 0)
    _writeUInt16(buf, value, offset, littleEndian, noAssert)
  else
    _writeUInt16(buf, 0xffff + value + 1, offset, littleEndian, noAssert)
}

Buffer.prototype.writeInt16LE = function (value, offset, noAssert) {
  _writeInt16(this, value, offset, true, noAssert)
}

Buffer.prototype.writeInt16BE = function (value, offset, noAssert) {
  _writeInt16(this, value, offset, false, noAssert)
}

function _writeInt32 (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 3 < buf.length, 'Trying to write beyond buffer length')
    verifsint(value, 0x7fffffff, -0x80000000)
  }

  var len = buf.length
  if (offset >= len)
    return

  if (value >= 0)
    _writeUInt32(buf, value, offset, littleEndian, noAssert)
  else
    _writeUInt32(buf, 0xffffffff + value + 1, offset, littleEndian, noAssert)
}

Buffer.prototype.writeInt32LE = function (value, offset, noAssert) {
  _writeInt32(this, value, offset, true, noAssert)
}

Buffer.prototype.writeInt32BE = function (value, offset, noAssert) {
  _writeInt32(this, value, offset, false, noAssert)
}

function _writeFloat (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 3 < buf.length, 'Trying to write beyond buffer length')
    verifIEEE754(value, 3.4028234663852886e+38, -3.4028234663852886e+38)
  }

  var len = buf.length
  if (offset >= len)
    return

  ieee754.write(buf, value, offset, littleEndian, 23, 4)
}

Buffer.prototype.writeFloatLE = function (value, offset, noAssert) {
  _writeFloat(this, value, offset, true, noAssert)
}

Buffer.prototype.writeFloatBE = function (value, offset, noAssert) {
  _writeFloat(this, value, offset, false, noAssert)
}

function _writeDouble (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 7 < buf.length,
        'Trying to write beyond buffer length')
    verifIEEE754(value, 1.7976931348623157E+308, -1.7976931348623157E+308)
  }

  var len = buf.length
  if (offset >= len)
    return

  ieee754.write(buf, value, offset, littleEndian, 52, 8)
}

Buffer.prototype.writeDoubleLE = function (value, offset, noAssert) {
  _writeDouble(this, value, offset, true, noAssert)
}

Buffer.prototype.writeDoubleBE = function (value, offset, noAssert) {
  _writeDouble(this, value, offset, false, noAssert)
}

// fill(value, start=0, end=buffer.length)
Buffer.prototype.fill = function (value, start, end) {
  if (!value) value = 0
  if (!start) start = 0
  if (!end) end = this.length

  if (typeof value === 'string') {
    value = value.charCodeAt(0)
  }

  assert(typeof value === 'number' && !isNaN(value), 'value is not a number')
  assert(end >= start, 'end < start')

  // Fill 0 bytes; we're done
  if (end === start) return
  if (this.length === 0) return

  assert(start >= 0 && start < this.length, 'start out of bounds')
  assert(end >= 0 && end <= this.length, 'end out of bounds')

  for (var i = start; i < end; i++) {
    this[i] = value
  }
}

Buffer.prototype.inspect = function () {
  var out = []
  var len = this.length
  for (var i = 0; i < len; i++) {
    out[i] = toHex(this[i])
    if (i === exports.INSPECT_MAX_BYTES) {
      out[i + 1] = '...'
      break
    }
  }
  return '<Buffer ' + out.join(' ') + '>'
}

/**
 * Creates a new `ArrayBuffer` with the *copied* memory of the buffer instance.
 * Added in Node 0.12. Only available in browsers that support ArrayBuffer.
 */
Buffer.prototype.toArrayBuffer = function () {
  if (typeof Uint8Array !== 'undefined') {
    if (Buffer._useTypedArrays) {
      return (new Buffer(this)).buffer
    } else {
      var buf = new Uint8Array(this.length)
      for (var i = 0, len = buf.length; i < len; i += 1)
        buf[i] = this[i]
      return buf.buffer
    }
  } else {
    throw new Error('Buffer.toArrayBuffer not supported in this browser')
  }
}

// HELPER FUNCTIONS
// ================

function stringtrim (str) {
  if (str.trim) return str.trim()
  return str.replace(/^\s+|\s+$/g, '')
}

var BP = Buffer.prototype

/**
 * Augment a Uint8Array *instance* (not the Uint8Array class!) with Buffer methods
 */
Buffer._augment = function (arr) {
  arr._isBuffer = true

  // save reference to original Uint8Array get/set methods before overwriting
  arr._get = arr.get
  arr._set = arr.set

  // deprecated, will be removed in node 0.13+
  arr.get = BP.get
  arr.set = BP.set

  arr.write = BP.write
  arr.toString = BP.toString
  arr.toLocaleString = BP.toString
  arr.toJSON = BP.toJSON
  arr.copy = BP.copy
  arr.slice = BP.slice
  arr.readUInt8 = BP.readUInt8
  arr.readUInt16LE = BP.readUInt16LE
  arr.readUInt16BE = BP.readUInt16BE
  arr.readUInt32LE = BP.readUInt32LE
  arr.readUInt32BE = BP.readUInt32BE
  arr.readInt8 = BP.readInt8
  arr.readInt16LE = BP.readInt16LE
  arr.readInt16BE = BP.readInt16BE
  arr.readInt32LE = BP.readInt32LE
  arr.readInt32BE = BP.readInt32BE
  arr.readFloatLE = BP.readFloatLE
  arr.readFloatBE = BP.readFloatBE
  arr.readDoubleLE = BP.readDoubleLE
  arr.readDoubleBE = BP.readDoubleBE
  arr.writeUInt8 = BP.writeUInt8
  arr.writeUInt16LE = BP.writeUInt16LE
  arr.writeUInt16BE = BP.writeUInt16BE
  arr.writeUInt32LE = BP.writeUInt32LE
  arr.writeUInt32BE = BP.writeUInt32BE
  arr.writeInt8 = BP.writeInt8
  arr.writeInt16LE = BP.writeInt16LE
  arr.writeInt16BE = BP.writeInt16BE
  arr.writeInt32LE = BP.writeInt32LE
  arr.writeInt32BE = BP.writeInt32BE
  arr.writeFloatLE = BP.writeFloatLE
  arr.writeFloatBE = BP.writeFloatBE
  arr.writeDoubleLE = BP.writeDoubleLE
  arr.writeDoubleBE = BP.writeDoubleBE
  arr.fill = BP.fill
  arr.inspect = BP.inspect
  arr.toArrayBuffer = BP.toArrayBuffer

  return arr
}

// slice(start, end)
function clamp (index, len, defaultValue) {
  if (typeof index !== 'number') return defaultValue
  index = ~~index;  // Coerce to integer.
  if (index >= len) return len
  if (index >= 0) return index
  index += len
  if (index >= 0) return index
  return 0
}

function coerce (length) {
  // Coerce length to a number (possibly NaN), round up
  // in case it's fractional (e.g. 123.456) then do a
  // double negate to coerce a NaN to 0. Easy, right?
  length = ~~Math.ceil(+length)
  return length < 0 ? 0 : length
}

function isArray (subject) {
  return (Array.isArray || function (subject) {
    return Object.prototype.toString.call(subject) === '[object Array]'
  })(subject)
}

function isArrayish (subject) {
  return isArray(subject) || Buffer.isBuffer(subject) ||
      subject && typeof subject === 'object' &&
      typeof subject.length === 'number'
}

function toHex (n) {
  if (n < 16) return '0' + n.toString(16)
  return n.toString(16)
}

function utf8ToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; i++) {
    var b = str.charCodeAt(i)
    if (b <= 0x7F)
      byteArray.push(str.charCodeAt(i))
    else {
      var start = i
      if (b >= 0xD800 && b <= 0xDFFF) i++
      var h = encodeURIComponent(str.slice(start, i+1)).substr(1).split('%')
      for (var j = 0; j < h.length; j++)
        byteArray.push(parseInt(h[j], 16))
    }
  }
  return byteArray
}

function asciiToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; i++) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF)
  }
  return byteArray
}

function utf16leToBytes (str) {
  var c, hi, lo
  var byteArray = []
  for (var i = 0; i < str.length; i++) {
    c = str.charCodeAt(i)
    hi = c >> 8
    lo = c % 256
    byteArray.push(lo)
    byteArray.push(hi)
  }

  return byteArray
}

function base64ToBytes (str) {
  return base64.toByteArray(str)
}

function blitBuffer (src, dst, offset, length) {
  var pos
  for (var i = 0; i < length; i++) {
    if ((i + offset >= dst.length) || (i >= src.length))
      break
    dst[i + offset] = src[i]
  }
  return i
}

function decodeUtf8Char (str) {
  try {
    return decodeURIComponent(str)
  } catch (err) {
    return String.fromCharCode(0xFFFD) // UTF 8 invalid char
  }
}

/*
 * We have to make sure that the value is a valid integer. This means that it
 * is non-negative. It has no fractional component and that it does not
 * exceed the maximum allowed value.
 */
function verifuint (value, max) {
  assert(typeof value === 'number', 'cannot write a non-number as a number')
  assert(value >= 0, 'specified a negative value for writing an unsigned value')
  assert(value <= max, 'value is larger than maximum value for type')
  assert(Math.floor(value) === value, 'value has a fractional component')
}

function verifsint (value, max, min) {
  assert(typeof value === 'number', 'cannot write a non-number as a number')
  assert(value <= max, 'value larger than maximum allowed value')
  assert(value >= min, 'value smaller than minimum allowed value')
  assert(Math.floor(value) === value, 'value has a fractional component')
}

function verifIEEE754 (value, max, min) {
  assert(typeof value === 'number', 'cannot write a non-number as a number')
  assert(value <= max, 'value larger than maximum allowed value')
  assert(value >= min, 'value smaller than minimum allowed value')
}

function assert (test, message) {
  if (!test) throw new Error(message || 'Failed assertion')
}
})
},{"base64-js":102,"ieee754":103,"tribe/client/enhancedDebug":97}],27:[function(require,module,exports){
require("tribe/client/enhancedDebug").execute("var Buffer = require('buffer').Buffer;\nvar intSize = 4;\nvar zeroBuffer = new Buffer(intSize); zeroBuffer.fill(0);\nvar chrsz = 8;\n\nfunction toArray(buf, bigEndian) {\n  if ((buf.length % intSize) !== 0) {\n    var len = buf.length + (intSize - (buf.length % intSize));\n    buf = Buffer.concat([buf, zeroBuffer], len);\n  }\n\n  var arr = [];\n  var fn = bigEndian ? buf.readInt32BE : buf.readInt32LE;\n  for (var i = 0; i < buf.length; i += intSize) {\n    arr.push(fn.call(buf, i));\n  }\n  return arr;\n}\n\nfunction toBuffer(arr, size, bigEndian) {\n  var buf = new Buffer(size);\n  var fn = bigEndian ? buf.writeInt32BE : buf.writeInt32LE;\n  for (var i = 0; i < arr.length; i++) {\n    fn.call(buf, arr[i], i * 4, true);\n  }\n  return buf;\n}\n\nfunction hash(buf, fn, hashSize, bigEndian) {\n  if (!Buffer.isBuffer(buf)) buf = new Buffer(buf);\n  var arr = fn(toArray(buf, bigEndian), buf.length * chrsz);\n  return toBuffer(arr, hashSize, bigEndian);\n}\n\nmodule.exports = { hash: hash };\n\n//@ sourceURL=http://tribe//node_modules/browserify/node_modules/crypto-browserify/helpers.js\n", arguments, window, require, module, exports);
(function () {var Buffer = require('buffer').Buffer;
var intSize = 4;
var zeroBuffer = new Buffer(intSize); zeroBuffer.fill(0);
var chrsz = 8;

function toArray(buf, bigEndian) {
  if ((buf.length % intSize) !== 0) {
    var len = buf.length + (intSize - (buf.length % intSize));
    buf = Buffer.concat([buf, zeroBuffer], len);
  }

  var arr = [];
  var fn = bigEndian ? buf.readInt32BE : buf.readInt32LE;
  for (var i = 0; i < buf.length; i += intSize) {
    arr.push(fn.call(buf, i));
  }
  return arr;
}

function toBuffer(arr, size, bigEndian) {
  var buf = new Buffer(size);
  var fn = bigEndian ? buf.writeInt32BE : buf.writeInt32LE;
  for (var i = 0; i < arr.length; i++) {
    fn.call(buf, arr[i], i * 4, true);
  }
  return buf;
}

function hash(buf, fn, hashSize, bigEndian) {
  if (!Buffer.isBuffer(buf)) buf = new Buffer(buf);
  var arr = fn(toArray(buf, bigEndian), buf.length * chrsz);
  return toBuffer(arr, hashSize, bigEndian);
}

module.exports = { hash: hash };
})
},{"buffer":26,"tribe/client/enhancedDebug":97}],28:[function(require,module,exports){
require("tribe/client/enhancedDebug").execute("var Buffer = require('buffer').Buffer\nvar sha = require('./sha')\nvar sha256 = require('./sha256')\nvar rng = require('./rng')\nvar md5 = require('./md5')\n\nvar algorithms = {\n  sha1: sha,\n  sha256: sha256,\n  md5: md5\n}\n\nvar blocksize = 64\nvar zeroBuffer = new Buffer(blocksize); zeroBuffer.fill(0)\nfunction hmac(fn, key, data) {\n  if(!Buffer.isBuffer(key)) key = new Buffer(key)\n  if(!Buffer.isBuffer(data)) data = new Buffer(data)\n\n  if(key.length > blocksize) {\n    key = fn(key)\n  } else if(key.length < blocksize) {\n    key = Buffer.concat([key, zeroBuffer], blocksize)\n  }\n\n  var ipad = new Buffer(blocksize), opad = new Buffer(blocksize)\n  for(var i = 0; i < blocksize; i++) {\n    ipad[i] = key[i] ^ 0x36\n    opad[i] = key[i] ^ 0x5C\n  }\n\n  var hash = fn(Buffer.concat([ipad, data]))\n  return fn(Buffer.concat([opad, hash]))\n}\n\nfunction hash(alg, key) {\n  alg = alg || 'sha1'\n  var fn = algorithms[alg]\n  var bufs = []\n  var length = 0\n  if(!fn) error('algorithm:', alg, 'is not yet supported')\n  return {\n    update: function (data) {\n      if(!Buffer.isBuffer(data)) data = new Buffer(data)\n        \n      bufs.push(data)\n      length += data.length\n      return this\n    },\n    digest: function (enc) {\n      var buf = Buffer.concat(bufs)\n      var r = key ? hmac(fn, key, buf) : fn(buf)\n      bufs = null\n      return enc ? r.toString(enc) : r\n    }\n  }\n}\n\nfunction error () {\n  var m = [].slice.call(arguments).join(' ')\n  throw new Error([\n    m,\n    'we accept pull requests',\n    'http://github.com/dominictarr/crypto-browserify'\n    ].join('\\n'))\n}\n\nexports.createHash = function (alg) { return hash(alg) }\nexports.createHmac = function (alg, key) { return hash(alg, key) }\nexports.randomBytes = function(size, callback) {\n  if (callback && callback.call) {\n    try {\n      callback.call(this, undefined, new Buffer(rng(size)))\n    } catch (err) { callback(err) }\n  } else {\n    return new Buffer(rng(size))\n  }\n}\n\nfunction each(a, f) {\n  for(var i in a)\n    f(a[i], i)\n}\n\n// the least I can do is make error messages for the rest of the node.js/crypto api.\neach(['createCredentials'\n, 'createCipher'\n, 'createCipheriv'\n, 'createDecipher'\n, 'createDecipheriv'\n, 'createSign'\n, 'createVerify'\n, 'createDiffieHellman'\n, 'pbkdf2'], function (name) {\n  exports[name] = function () {\n    error('sorry,', name, 'is not implemented yet')\n  }\n})\n\n//@ sourceURL=http://tribe//node_modules/browserify/node_modules/crypto-browserify/index.js\n", arguments, window, require, module, exports);
(function () {var Buffer = require('buffer').Buffer
var sha = require('./sha')
var sha256 = require('./sha256')
var rng = require('./rng')
var md5 = require('./md5')

var algorithms = {
  sha1: sha,
  sha256: sha256,
  md5: md5
}

var blocksize = 64
var zeroBuffer = new Buffer(blocksize); zeroBuffer.fill(0)
function hmac(fn, key, data) {
  if(!Buffer.isBuffer(key)) key = new Buffer(key)
  if(!Buffer.isBuffer(data)) data = new Buffer(data)

  if(key.length > blocksize) {
    key = fn(key)
  } else if(key.length < blocksize) {
    key = Buffer.concat([key, zeroBuffer], blocksize)
  }

  var ipad = new Buffer(blocksize), opad = new Buffer(blocksize)
  for(var i = 0; i < blocksize; i++) {
    ipad[i] = key[i] ^ 0x36
    opad[i] = key[i] ^ 0x5C
  }

  var hash = fn(Buffer.concat([ipad, data]))
  return fn(Buffer.concat([opad, hash]))
}

function hash(alg, key) {
  alg = alg || 'sha1'
  var fn = algorithms[alg]
  var bufs = []
  var length = 0
  if(!fn) error('algorithm:', alg, 'is not yet supported')
  return {
    update: function (data) {
      if(!Buffer.isBuffer(data)) data = new Buffer(data)
        
      bufs.push(data)
      length += data.length
      return this
    },
    digest: function (enc) {
      var buf = Buffer.concat(bufs)
      var r = key ? hmac(fn, key, buf) : fn(buf)
      bufs = null
      return enc ? r.toString(enc) : r
    }
  }
}

function error () {
  var m = [].slice.call(arguments).join(' ')
  throw new Error([
    m,
    'we accept pull requests',
    'http://github.com/dominictarr/crypto-browserify'
    ].join('\n'))
}

exports.createHash = function (alg) { return hash(alg) }
exports.createHmac = function (alg, key) { return hash(alg, key) }
exports.randomBytes = function(size, callback) {
  if (callback && callback.call) {
    try {
      callback.call(this, undefined, new Buffer(rng(size)))
    } catch (err) { callback(err) }
  } else {
    return new Buffer(rng(size))
  }
}

function each(a, f) {
  for(var i in a)
    f(a[i], i)
}

// the least I can do is make error messages for the rest of the node.js/crypto api.
each(['createCredentials'
, 'createCipher'
, 'createCipheriv'
, 'createDecipher'
, 'createDecipheriv'
, 'createSign'
, 'createVerify'
, 'createDiffieHellman'
, 'pbkdf2'], function (name) {
  exports[name] = function () {
    error('sorry,', name, 'is not implemented yet')
  }
})
})
},{"./md5":29,"./rng":30,"./sha":31,"./sha256":32,"buffer":26,"tribe/client/enhancedDebug":97}],29:[function(require,module,exports){
require("tribe/client/enhancedDebug").execute("/*\n * A JavaScript implementation of the RSA Data Security, Inc. MD5 Message\n * Digest Algorithm, as defined in RFC 1321.\n * Version 2.1 Copyright (C) Paul Johnston 1999 - 2002.\n * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet\n * Distributed under the BSD License\n * See http://pajhome.org.uk/crypt/md5 for more info.\n */\n\nvar helpers = require('./helpers');\n\n/*\n * Perform a simple self-test to see if the VM is working\n */\nfunction md5_vm_test()\n{\n  return hex_md5(\"abc\") == \"900150983cd24fb0d6963f7d28e17f72\";\n}\n\n/*\n * Calculate the MD5 of an array of little-endian words, and a bit length\n */\nfunction core_md5(x, len)\n{\n  /* append padding */\n  x[len >> 5] |= 0x80 << ((len) % 32);\n  x[(((len + 64) >>> 9) << 4) + 14] = len;\n\n  var a =  1732584193;\n  var b = -271733879;\n  var c = -1732584194;\n  var d =  271733878;\n\n  for(var i = 0; i < x.length; i += 16)\n  {\n    var olda = a;\n    var oldb = b;\n    var oldc = c;\n    var oldd = d;\n\n    a = md5_ff(a, b, c, d, x[i+ 0], 7 , -680876936);\n    d = md5_ff(d, a, b, c, x[i+ 1], 12, -389564586);\n    c = md5_ff(c, d, a, b, x[i+ 2], 17,  606105819);\n    b = md5_ff(b, c, d, a, x[i+ 3], 22, -1044525330);\n    a = md5_ff(a, b, c, d, x[i+ 4], 7 , -176418897);\n    d = md5_ff(d, a, b, c, x[i+ 5], 12,  1200080426);\n    c = md5_ff(c, d, a, b, x[i+ 6], 17, -1473231341);\n    b = md5_ff(b, c, d, a, x[i+ 7], 22, -45705983);\n    a = md5_ff(a, b, c, d, x[i+ 8], 7 ,  1770035416);\n    d = md5_ff(d, a, b, c, x[i+ 9], 12, -1958414417);\n    c = md5_ff(c, d, a, b, x[i+10], 17, -42063);\n    b = md5_ff(b, c, d, a, x[i+11], 22, -1990404162);\n    a = md5_ff(a, b, c, d, x[i+12], 7 ,  1804603682);\n    d = md5_ff(d, a, b, c, x[i+13], 12, -40341101);\n    c = md5_ff(c, d, a, b, x[i+14], 17, -1502002290);\n    b = md5_ff(b, c, d, a, x[i+15], 22,  1236535329);\n\n    a = md5_gg(a, b, c, d, x[i+ 1], 5 , -165796510);\n    d = md5_gg(d, a, b, c, x[i+ 6], 9 , -1069501632);\n    c = md5_gg(c, d, a, b, x[i+11], 14,  643717713);\n    b = md5_gg(b, c, d, a, x[i+ 0], 20, -373897302);\n    a = md5_gg(a, b, c, d, x[i+ 5], 5 , -701558691);\n    d = md5_gg(d, a, b, c, x[i+10], 9 ,  38016083);\n    c = md5_gg(c, d, a, b, x[i+15], 14, -660478335);\n    b = md5_gg(b, c, d, a, x[i+ 4], 20, -405537848);\n    a = md5_gg(a, b, c, d, x[i+ 9], 5 ,  568446438);\n    d = md5_gg(d, a, b, c, x[i+14], 9 , -1019803690);\n    c = md5_gg(c, d, a, b, x[i+ 3], 14, -187363961);\n    b = md5_gg(b, c, d, a, x[i+ 8], 20,  1163531501);\n    a = md5_gg(a, b, c, d, x[i+13], 5 , -1444681467);\n    d = md5_gg(d, a, b, c, x[i+ 2], 9 , -51403784);\n    c = md5_gg(c, d, a, b, x[i+ 7], 14,  1735328473);\n    b = md5_gg(b, c, d, a, x[i+12], 20, -1926607734);\n\n    a = md5_hh(a, b, c, d, x[i+ 5], 4 , -378558);\n    d = md5_hh(d, a, b, c, x[i+ 8], 11, -2022574463);\n    c = md5_hh(c, d, a, b, x[i+11], 16,  1839030562);\n    b = md5_hh(b, c, d, a, x[i+14], 23, -35309556);\n    a = md5_hh(a, b, c, d, x[i+ 1], 4 , -1530992060);\n    d = md5_hh(d, a, b, c, x[i+ 4], 11,  1272893353);\n    c = md5_hh(c, d, a, b, x[i+ 7], 16, -155497632);\n    b = md5_hh(b, c, d, a, x[i+10], 23, -1094730640);\n    a = md5_hh(a, b, c, d, x[i+13], 4 ,  681279174);\n    d = md5_hh(d, a, b, c, x[i+ 0], 11, -358537222);\n    c = md5_hh(c, d, a, b, x[i+ 3], 16, -722521979);\n    b = md5_hh(b, c, d, a, x[i+ 6], 23,  76029189);\n    a = md5_hh(a, b, c, d, x[i+ 9], 4 , -640364487);\n    d = md5_hh(d, a, b, c, x[i+12], 11, -421815835);\n    c = md5_hh(c, d, a, b, x[i+15], 16,  530742520);\n    b = md5_hh(b, c, d, a, x[i+ 2], 23, -995338651);\n\n    a = md5_ii(a, b, c, d, x[i+ 0], 6 , -198630844);\n    d = md5_ii(d, a, b, c, x[i+ 7], 10,  1126891415);\n    c = md5_ii(c, d, a, b, x[i+14], 15, -1416354905);\n    b = md5_ii(b, c, d, a, x[i+ 5], 21, -57434055);\n    a = md5_ii(a, b, c, d, x[i+12], 6 ,  1700485571);\n    d = md5_ii(d, a, b, c, x[i+ 3], 10, -1894986606);\n    c = md5_ii(c, d, a, b, x[i+10], 15, -1051523);\n    b = md5_ii(b, c, d, a, x[i+ 1], 21, -2054922799);\n    a = md5_ii(a, b, c, d, x[i+ 8], 6 ,  1873313359);\n    d = md5_ii(d, a, b, c, x[i+15], 10, -30611744);\n    c = md5_ii(c, d, a, b, x[i+ 6], 15, -1560198380);\n    b = md5_ii(b, c, d, a, x[i+13], 21,  1309151649);\n    a = md5_ii(a, b, c, d, x[i+ 4], 6 , -145523070);\n    d = md5_ii(d, a, b, c, x[i+11], 10, -1120210379);\n    c = md5_ii(c, d, a, b, x[i+ 2], 15,  718787259);\n    b = md5_ii(b, c, d, a, x[i+ 9], 21, -343485551);\n\n    a = safe_add(a, olda);\n    b = safe_add(b, oldb);\n    c = safe_add(c, oldc);\n    d = safe_add(d, oldd);\n  }\n  return Array(a, b, c, d);\n\n}\n\n/*\n * These functions implement the four basic operations the algorithm uses.\n */\nfunction md5_cmn(q, a, b, x, s, t)\n{\n  return safe_add(bit_rol(safe_add(safe_add(a, q), safe_add(x, t)), s),b);\n}\nfunction md5_ff(a, b, c, d, x, s, t)\n{\n  return md5_cmn((b & c) | ((~b) & d), a, b, x, s, t);\n}\nfunction md5_gg(a, b, c, d, x, s, t)\n{\n  return md5_cmn((b & d) | (c & (~d)), a, b, x, s, t);\n}\nfunction md5_hh(a, b, c, d, x, s, t)\n{\n  return md5_cmn(b ^ c ^ d, a, b, x, s, t);\n}\nfunction md5_ii(a, b, c, d, x, s, t)\n{\n  return md5_cmn(c ^ (b | (~d)), a, b, x, s, t);\n}\n\n/*\n * Add integers, wrapping at 2^32. This uses 16-bit operations internally\n * to work around bugs in some JS interpreters.\n */\nfunction safe_add(x, y)\n{\n  var lsw = (x & 0xFFFF) + (y & 0xFFFF);\n  var msw = (x >> 16) + (y >> 16) + (lsw >> 16);\n  return (msw << 16) | (lsw & 0xFFFF);\n}\n\n/*\n * Bitwise rotate a 32-bit number to the left.\n */\nfunction bit_rol(num, cnt)\n{\n  return (num << cnt) | (num >>> (32 - cnt));\n}\n\nmodule.exports = function md5(buf) {\n  return helpers.hash(buf, core_md5, 16);\n};\n\n//@ sourceURL=http://tribe//node_modules/browserify/node_modules/crypto-browserify/md5.js\n", arguments, window, require, module, exports);
(function () {/*
 * A JavaScript implementation of the RSA Data Security, Inc. MD5 Message
 * Digest Algorithm, as defined in RFC 1321.
 * Version 2.1 Copyright (C) Paul Johnston 1999 - 2002.
 * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
 * Distributed under the BSD License
 * See http://pajhome.org.uk/crypt/md5 for more info.
 */

var helpers = require('./helpers');

/*
 * Perform a simple self-test to see if the VM is working
 */
function md5_vm_test()
{
  return hex_md5("abc") == "900150983cd24fb0d6963f7d28e17f72";
}

/*
 * Calculate the MD5 of an array of little-endian words, and a bit length
 */
function core_md5(x, len)
{
  /* append padding */
  x[len >> 5] |= 0x80 << ((len) % 32);
  x[(((len + 64) >>> 9) << 4) + 14] = len;

  var a =  1732584193;
  var b = -271733879;
  var c = -1732584194;
  var d =  271733878;

  for(var i = 0; i < x.length; i += 16)
  {
    var olda = a;
    var oldb = b;
    var oldc = c;
    var oldd = d;

    a = md5_ff(a, b, c, d, x[i+ 0], 7 , -680876936);
    d = md5_ff(d, a, b, c, x[i+ 1], 12, -389564586);
    c = md5_ff(c, d, a, b, x[i+ 2], 17,  606105819);
    b = md5_ff(b, c, d, a, x[i+ 3], 22, -1044525330);
    a = md5_ff(a, b, c, d, x[i+ 4], 7 , -176418897);
    d = md5_ff(d, a, b, c, x[i+ 5], 12,  1200080426);
    c = md5_ff(c, d, a, b, x[i+ 6], 17, -1473231341);
    b = md5_ff(b, c, d, a, x[i+ 7], 22, -45705983);
    a = md5_ff(a, b, c, d, x[i+ 8], 7 ,  1770035416);
    d = md5_ff(d, a, b, c, x[i+ 9], 12, -1958414417);
    c = md5_ff(c, d, a, b, x[i+10], 17, -42063);
    b = md5_ff(b, c, d, a, x[i+11], 22, -1990404162);
    a = md5_ff(a, b, c, d, x[i+12], 7 ,  1804603682);
    d = md5_ff(d, a, b, c, x[i+13], 12, -40341101);
    c = md5_ff(c, d, a, b, x[i+14], 17, -1502002290);
    b = md5_ff(b, c, d, a, x[i+15], 22,  1236535329);

    a = md5_gg(a, b, c, d, x[i+ 1], 5 , -165796510);
    d = md5_gg(d, a, b, c, x[i+ 6], 9 , -1069501632);
    c = md5_gg(c, d, a, b, x[i+11], 14,  643717713);
    b = md5_gg(b, c, d, a, x[i+ 0], 20, -373897302);
    a = md5_gg(a, b, c, d, x[i+ 5], 5 , -701558691);
    d = md5_gg(d, a, b, c, x[i+10], 9 ,  38016083);
    c = md5_gg(c, d, a, b, x[i+15], 14, -660478335);
    b = md5_gg(b, c, d, a, x[i+ 4], 20, -405537848);
    a = md5_gg(a, b, c, d, x[i+ 9], 5 ,  568446438);
    d = md5_gg(d, a, b, c, x[i+14], 9 , -1019803690);
    c = md5_gg(c, d, a, b, x[i+ 3], 14, -187363961);
    b = md5_gg(b, c, d, a, x[i+ 8], 20,  1163531501);
    a = md5_gg(a, b, c, d, x[i+13], 5 , -1444681467);
    d = md5_gg(d, a, b, c, x[i+ 2], 9 , -51403784);
    c = md5_gg(c, d, a, b, x[i+ 7], 14,  1735328473);
    b = md5_gg(b, c, d, a, x[i+12], 20, -1926607734);

    a = md5_hh(a, b, c, d, x[i+ 5], 4 , -378558);
    d = md5_hh(d, a, b, c, x[i+ 8], 11, -2022574463);
    c = md5_hh(c, d, a, b, x[i+11], 16,  1839030562);
    b = md5_hh(b, c, d, a, x[i+14], 23, -35309556);
    a = md5_hh(a, b, c, d, x[i+ 1], 4 , -1530992060);
    d = md5_hh(d, a, b, c, x[i+ 4], 11,  1272893353);
    c = md5_hh(c, d, a, b, x[i+ 7], 16, -155497632);
    b = md5_hh(b, c, d, a, x[i+10], 23, -1094730640);
    a = md5_hh(a, b, c, d, x[i+13], 4 ,  681279174);
    d = md5_hh(d, a, b, c, x[i+ 0], 11, -358537222);
    c = md5_hh(c, d, a, b, x[i+ 3], 16, -722521979);
    b = md5_hh(b, c, d, a, x[i+ 6], 23,  76029189);
    a = md5_hh(a, b, c, d, x[i+ 9], 4 , -640364487);
    d = md5_hh(d, a, b, c, x[i+12], 11, -421815835);
    c = md5_hh(c, d, a, b, x[i+15], 16,  530742520);
    b = md5_hh(b, c, d, a, x[i+ 2], 23, -995338651);

    a = md5_ii(a, b, c, d, x[i+ 0], 6 , -198630844);
    d = md5_ii(d, a, b, c, x[i+ 7], 10,  1126891415);
    c = md5_ii(c, d, a, b, x[i+14], 15, -1416354905);
    b = md5_ii(b, c, d, a, x[i+ 5], 21, -57434055);
    a = md5_ii(a, b, c, d, x[i+12], 6 ,  1700485571);
    d = md5_ii(d, a, b, c, x[i+ 3], 10, -1894986606);
    c = md5_ii(c, d, a, b, x[i+10], 15, -1051523);
    b = md5_ii(b, c, d, a, x[i+ 1], 21, -2054922799);
    a = md5_ii(a, b, c, d, x[i+ 8], 6 ,  1873313359);
    d = md5_ii(d, a, b, c, x[i+15], 10, -30611744);
    c = md5_ii(c, d, a, b, x[i+ 6], 15, -1560198380);
    b = md5_ii(b, c, d, a, x[i+13], 21,  1309151649);
    a = md5_ii(a, b, c, d, x[i+ 4], 6 , -145523070);
    d = md5_ii(d, a, b, c, x[i+11], 10, -1120210379);
    c = md5_ii(c, d, a, b, x[i+ 2], 15,  718787259);
    b = md5_ii(b, c, d, a, x[i+ 9], 21, -343485551);

    a = safe_add(a, olda);
    b = safe_add(b, oldb);
    c = safe_add(c, oldc);
    d = safe_add(d, oldd);
  }
  return Array(a, b, c, d);

}

/*
 * These functions implement the four basic operations the algorithm uses.
 */
function md5_cmn(q, a, b, x, s, t)
{
  return safe_add(bit_rol(safe_add(safe_add(a, q), safe_add(x, t)), s),b);
}
function md5_ff(a, b, c, d, x, s, t)
{
  return md5_cmn((b & c) | ((~b) & d), a, b, x, s, t);
}
function md5_gg(a, b, c, d, x, s, t)
{
  return md5_cmn((b & d) | (c & (~d)), a, b, x, s, t);
}
function md5_hh(a, b, c, d, x, s, t)
{
  return md5_cmn(b ^ c ^ d, a, b, x, s, t);
}
function md5_ii(a, b, c, d, x, s, t)
{
  return md5_cmn(c ^ (b | (~d)), a, b, x, s, t);
}

/*
 * Add integers, wrapping at 2^32. This uses 16-bit operations internally
 * to work around bugs in some JS interpreters.
 */
function safe_add(x, y)
{
  var lsw = (x & 0xFFFF) + (y & 0xFFFF);
  var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
  return (msw << 16) | (lsw & 0xFFFF);
}

/*
 * Bitwise rotate a 32-bit number to the left.
 */
function bit_rol(num, cnt)
{
  return (num << cnt) | (num >>> (32 - cnt));
}

module.exports = function md5(buf) {
  return helpers.hash(buf, core_md5, 16);
};
})
},{"./helpers":27,"tribe/client/enhancedDebug":97}],30:[function(require,module,exports){
require("tribe/client/enhancedDebug").execute("// Original code adapted from Robert Kieffer.\n// details at https://github.com/broofa/node-uuid\n(function() {\n  var _global = this;\n\n  var mathRNG, whatwgRNG;\n\n  // NOTE: Math.random() does not guarantee \"cryptographic quality\"\n  mathRNG = function(size) {\n    var bytes = new Array(size);\n    var r;\n\n    for (var i = 0, r; i < size; i++) {\n      if ((i & 0x03) == 0) r = Math.random() * 0x100000000;\n      bytes[i] = r >>> ((i & 0x03) << 3) & 0xff;\n    }\n\n    return bytes;\n  }\n\n  if (_global.crypto && crypto.getRandomValues) {\n    whatwgRNG = function(size) {\n      var bytes = new Uint8Array(size);\n      crypto.getRandomValues(bytes);\n      return bytes;\n    }\n  }\n\n  module.exports = whatwgRNG || mathRNG;\n\n}())\n\n//@ sourceURL=http://tribe//node_modules/browserify/node_modules/crypto-browserify/rng.js\n", arguments, window, require, module, exports);
(function () {// Original code adapted from Robert Kieffer.
// details at https://github.com/broofa/node-uuid
(function() {
  var _global = this;

  var mathRNG, whatwgRNG;

  // NOTE: Math.random() does not guarantee "cryptographic quality"
  mathRNG = function(size) {
    var bytes = new Array(size);
    var r;

    for (var i = 0, r; i < size; i++) {
      if ((i & 0x03) == 0) r = Math.random() * 0x100000000;
      bytes[i] = r >>> ((i & 0x03) << 3) & 0xff;
    }

    return bytes;
  }

  if (_global.crypto && crypto.getRandomValues) {
    whatwgRNG = function(size) {
      var bytes = new Uint8Array(size);
      crypto.getRandomValues(bytes);
      return bytes;
    }
  }

  module.exports = whatwgRNG || mathRNG;

}())
})
},{"tribe/client/enhancedDebug":97}],31:[function(require,module,exports){
require("tribe/client/enhancedDebug").execute("/*\n * A JavaScript implementation of the Secure Hash Algorithm, SHA-1, as defined\n * in FIPS PUB 180-1\n * Version 2.1a Copyright Paul Johnston 2000 - 2002.\n * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet\n * Distributed under the BSD License\n * See http://pajhome.org.uk/crypt/md5 for details.\n */\n\nvar helpers = require('./helpers');\n\n/*\n * Calculate the SHA-1 of an array of big-endian words, and a bit length\n */\nfunction core_sha1(x, len)\n{\n  /* append padding */\n  x[len >> 5] |= 0x80 << (24 - len % 32);\n  x[((len + 64 >> 9) << 4) + 15] = len;\n\n  var w = Array(80);\n  var a =  1732584193;\n  var b = -271733879;\n  var c = -1732584194;\n  var d =  271733878;\n  var e = -1009589776;\n\n  for(var i = 0; i < x.length; i += 16)\n  {\n    var olda = a;\n    var oldb = b;\n    var oldc = c;\n    var oldd = d;\n    var olde = e;\n\n    for(var j = 0; j < 80; j++)\n    {\n      if(j < 16) w[j] = x[i + j];\n      else w[j] = rol(w[j-3] ^ w[j-8] ^ w[j-14] ^ w[j-16], 1);\n      var t = safe_add(safe_add(rol(a, 5), sha1_ft(j, b, c, d)),\n                       safe_add(safe_add(e, w[j]), sha1_kt(j)));\n      e = d;\n      d = c;\n      c = rol(b, 30);\n      b = a;\n      a = t;\n    }\n\n    a = safe_add(a, olda);\n    b = safe_add(b, oldb);\n    c = safe_add(c, oldc);\n    d = safe_add(d, oldd);\n    e = safe_add(e, olde);\n  }\n  return Array(a, b, c, d, e);\n\n}\n\n/*\n * Perform the appropriate triplet combination function for the current\n * iteration\n */\nfunction sha1_ft(t, b, c, d)\n{\n  if(t < 20) return (b & c) | ((~b) & d);\n  if(t < 40) return b ^ c ^ d;\n  if(t < 60) return (b & c) | (b & d) | (c & d);\n  return b ^ c ^ d;\n}\n\n/*\n * Determine the appropriate additive constant for the current iteration\n */\nfunction sha1_kt(t)\n{\n  return (t < 20) ?  1518500249 : (t < 40) ?  1859775393 :\n         (t < 60) ? -1894007588 : -899497514;\n}\n\n/*\n * Add integers, wrapping at 2^32. This uses 16-bit operations internally\n * to work around bugs in some JS interpreters.\n */\nfunction safe_add(x, y)\n{\n  var lsw = (x & 0xFFFF) + (y & 0xFFFF);\n  var msw = (x >> 16) + (y >> 16) + (lsw >> 16);\n  return (msw << 16) | (lsw & 0xFFFF);\n}\n\n/*\n * Bitwise rotate a 32-bit number to the left.\n */\nfunction rol(num, cnt)\n{\n  return (num << cnt) | (num >>> (32 - cnt));\n}\n\nmodule.exports = function sha1(buf) {\n  return helpers.hash(buf, core_sha1, 20, true);\n};\n\n//@ sourceURL=http://tribe//node_modules/browserify/node_modules/crypto-browserify/sha.js\n", arguments, window, require, module, exports);
(function () {/*
 * A JavaScript implementation of the Secure Hash Algorithm, SHA-1, as defined
 * in FIPS PUB 180-1
 * Version 2.1a Copyright Paul Johnston 2000 - 2002.
 * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
 * Distributed under the BSD License
 * See http://pajhome.org.uk/crypt/md5 for details.
 */

var helpers = require('./helpers');

/*
 * Calculate the SHA-1 of an array of big-endian words, and a bit length
 */
function core_sha1(x, len)
{
  /* append padding */
  x[len >> 5] |= 0x80 << (24 - len % 32);
  x[((len + 64 >> 9) << 4) + 15] = len;

  var w = Array(80);
  var a =  1732584193;
  var b = -271733879;
  var c = -1732584194;
  var d =  271733878;
  var e = -1009589776;

  for(var i = 0; i < x.length; i += 16)
  {
    var olda = a;
    var oldb = b;
    var oldc = c;
    var oldd = d;
    var olde = e;

    for(var j = 0; j < 80; j++)
    {
      if(j < 16) w[j] = x[i + j];
      else w[j] = rol(w[j-3] ^ w[j-8] ^ w[j-14] ^ w[j-16], 1);
      var t = safe_add(safe_add(rol(a, 5), sha1_ft(j, b, c, d)),
                       safe_add(safe_add(e, w[j]), sha1_kt(j)));
      e = d;
      d = c;
      c = rol(b, 30);
      b = a;
      a = t;
    }

    a = safe_add(a, olda);
    b = safe_add(b, oldb);
    c = safe_add(c, oldc);
    d = safe_add(d, oldd);
    e = safe_add(e, olde);
  }
  return Array(a, b, c, d, e);

}

/*
 * Perform the appropriate triplet combination function for the current
 * iteration
 */
function sha1_ft(t, b, c, d)
{
  if(t < 20) return (b & c) | ((~b) & d);
  if(t < 40) return b ^ c ^ d;
  if(t < 60) return (b & c) | (b & d) | (c & d);
  return b ^ c ^ d;
}

/*
 * Determine the appropriate additive constant for the current iteration
 */
function sha1_kt(t)
{
  return (t < 20) ?  1518500249 : (t < 40) ?  1859775393 :
         (t < 60) ? -1894007588 : -899497514;
}

/*
 * Add integers, wrapping at 2^32. This uses 16-bit operations internally
 * to work around bugs in some JS interpreters.
 */
function safe_add(x, y)
{
  var lsw = (x & 0xFFFF) + (y & 0xFFFF);
  var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
  return (msw << 16) | (lsw & 0xFFFF);
}

/*
 * Bitwise rotate a 32-bit number to the left.
 */
function rol(num, cnt)
{
  return (num << cnt) | (num >>> (32 - cnt));
}

module.exports = function sha1(buf) {
  return helpers.hash(buf, core_sha1, 20, true);
};
})
},{"./helpers":27,"tribe/client/enhancedDebug":97}],32:[function(require,module,exports){
require("tribe/client/enhancedDebug").execute("\n/**\n * A JavaScript implementation of the Secure Hash Algorithm, SHA-256, as defined\n * in FIPS 180-2\n * Version 2.2-beta Copyright Angel Marin, Paul Johnston 2000 - 2009.\n * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet\n *\n */\n\nvar helpers = require('./helpers');\n\nvar safe_add = function(x, y) {\n  var lsw = (x & 0xFFFF) + (y & 0xFFFF);\n  var msw = (x >> 16) + (y >> 16) + (lsw >> 16);\n  return (msw << 16) | (lsw & 0xFFFF);\n};\n\nvar S = function(X, n) {\n  return (X >>> n) | (X << (32 - n));\n};\n\nvar R = function(X, n) {\n  return (X >>> n);\n};\n\nvar Ch = function(x, y, z) {\n  return ((x & y) ^ ((~x) & z));\n};\n\nvar Maj = function(x, y, z) {\n  return ((x & y) ^ (x & z) ^ (y & z));\n};\n\nvar Sigma0256 = function(x) {\n  return (S(x, 2) ^ S(x, 13) ^ S(x, 22));\n};\n\nvar Sigma1256 = function(x) {\n  return (S(x, 6) ^ S(x, 11) ^ S(x, 25));\n};\n\nvar Gamma0256 = function(x) {\n  return (S(x, 7) ^ S(x, 18) ^ R(x, 3));\n};\n\nvar Gamma1256 = function(x) {\n  return (S(x, 17) ^ S(x, 19) ^ R(x, 10));\n};\n\nvar core_sha256 = function(m, l) {\n  var K = new Array(0x428A2F98,0x71374491,0xB5C0FBCF,0xE9B5DBA5,0x3956C25B,0x59F111F1,0x923F82A4,0xAB1C5ED5,0xD807AA98,0x12835B01,0x243185BE,0x550C7DC3,0x72BE5D74,0x80DEB1FE,0x9BDC06A7,0xC19BF174,0xE49B69C1,0xEFBE4786,0xFC19DC6,0x240CA1CC,0x2DE92C6F,0x4A7484AA,0x5CB0A9DC,0x76F988DA,0x983E5152,0xA831C66D,0xB00327C8,0xBF597FC7,0xC6E00BF3,0xD5A79147,0x6CA6351,0x14292967,0x27B70A85,0x2E1B2138,0x4D2C6DFC,0x53380D13,0x650A7354,0x766A0ABB,0x81C2C92E,0x92722C85,0xA2BFE8A1,0xA81A664B,0xC24B8B70,0xC76C51A3,0xD192E819,0xD6990624,0xF40E3585,0x106AA070,0x19A4C116,0x1E376C08,0x2748774C,0x34B0BCB5,0x391C0CB3,0x4ED8AA4A,0x5B9CCA4F,0x682E6FF3,0x748F82EE,0x78A5636F,0x84C87814,0x8CC70208,0x90BEFFFA,0xA4506CEB,0xBEF9A3F7,0xC67178F2);\n  var HASH = new Array(0x6A09E667, 0xBB67AE85, 0x3C6EF372, 0xA54FF53A, 0x510E527F, 0x9B05688C, 0x1F83D9AB, 0x5BE0CD19);\n    var W = new Array(64);\n    var a, b, c, d, e, f, g, h, i, j;\n    var T1, T2;\n  /* append padding */\n  m[l >> 5] |= 0x80 << (24 - l % 32);\n  m[((l + 64 >> 9) << 4) + 15] = l;\n  for (var i = 0; i < m.length; i += 16) {\n    a = HASH[0]; b = HASH[1]; c = HASH[2]; d = HASH[3]; e = HASH[4]; f = HASH[5]; g = HASH[6]; h = HASH[7];\n    for (var j = 0; j < 64; j++) {\n      if (j < 16) {\n        W[j] = m[j + i];\n      } else {\n        W[j] = safe_add(safe_add(safe_add(Gamma1256(W[j - 2]), W[j - 7]), Gamma0256(W[j - 15])), W[j - 16]);\n      }\n      T1 = safe_add(safe_add(safe_add(safe_add(h, Sigma1256(e)), Ch(e, f, g)), K[j]), W[j]);\n      T2 = safe_add(Sigma0256(a), Maj(a, b, c));\n      h = g; g = f; f = e; e = safe_add(d, T1); d = c; c = b; b = a; a = safe_add(T1, T2);\n    }\n    HASH[0] = safe_add(a, HASH[0]); HASH[1] = safe_add(b, HASH[1]); HASH[2] = safe_add(c, HASH[2]); HASH[3] = safe_add(d, HASH[3]);\n    HASH[4] = safe_add(e, HASH[4]); HASH[5] = safe_add(f, HASH[5]); HASH[6] = safe_add(g, HASH[6]); HASH[7] = safe_add(h, HASH[7]);\n  }\n  return HASH;\n};\n\nmodule.exports = function sha256(buf) {\n  return helpers.hash(buf, core_sha256, 32, true);\n};\n\n//@ sourceURL=http://tribe//node_modules/browserify/node_modules/crypto-browserify/sha256.js\n", arguments, window, require, module, exports);
(function () {
/**
 * A JavaScript implementation of the Secure Hash Algorithm, SHA-256, as defined
 * in FIPS 180-2
 * Version 2.2-beta Copyright Angel Marin, Paul Johnston 2000 - 2009.
 * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
 *
 */

var helpers = require('./helpers');

var safe_add = function(x, y) {
  var lsw = (x & 0xFFFF) + (y & 0xFFFF);
  var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
  return (msw << 16) | (lsw & 0xFFFF);
};

var S = function(X, n) {
  return (X >>> n) | (X << (32 - n));
};

var R = function(X, n) {
  return (X >>> n);
};

var Ch = function(x, y, z) {
  return ((x & y) ^ ((~x) & z));
};

var Maj = function(x, y, z) {
  return ((x & y) ^ (x & z) ^ (y & z));
};

var Sigma0256 = function(x) {
  return (S(x, 2) ^ S(x, 13) ^ S(x, 22));
};

var Sigma1256 = function(x) {
  return (S(x, 6) ^ S(x, 11) ^ S(x, 25));
};

var Gamma0256 = function(x) {
  return (S(x, 7) ^ S(x, 18) ^ R(x, 3));
};

var Gamma1256 = function(x) {
  return (S(x, 17) ^ S(x, 19) ^ R(x, 10));
};

var core_sha256 = function(m, l) {
  var K = new Array(0x428A2F98,0x71374491,0xB5C0FBCF,0xE9B5DBA5,0x3956C25B,0x59F111F1,0x923F82A4,0xAB1C5ED5,0xD807AA98,0x12835B01,0x243185BE,0x550C7DC3,0x72BE5D74,0x80DEB1FE,0x9BDC06A7,0xC19BF174,0xE49B69C1,0xEFBE4786,0xFC19DC6,0x240CA1CC,0x2DE92C6F,0x4A7484AA,0x5CB0A9DC,0x76F988DA,0x983E5152,0xA831C66D,0xB00327C8,0xBF597FC7,0xC6E00BF3,0xD5A79147,0x6CA6351,0x14292967,0x27B70A85,0x2E1B2138,0x4D2C6DFC,0x53380D13,0x650A7354,0x766A0ABB,0x81C2C92E,0x92722C85,0xA2BFE8A1,0xA81A664B,0xC24B8B70,0xC76C51A3,0xD192E819,0xD6990624,0xF40E3585,0x106AA070,0x19A4C116,0x1E376C08,0x2748774C,0x34B0BCB5,0x391C0CB3,0x4ED8AA4A,0x5B9CCA4F,0x682E6FF3,0x748F82EE,0x78A5636F,0x84C87814,0x8CC70208,0x90BEFFFA,0xA4506CEB,0xBEF9A3F7,0xC67178F2);
  var HASH = new Array(0x6A09E667, 0xBB67AE85, 0x3C6EF372, 0xA54FF53A, 0x510E527F, 0x9B05688C, 0x1F83D9AB, 0x5BE0CD19);
    var W = new Array(64);
    var a, b, c, d, e, f, g, h, i, j;
    var T1, T2;
  /* append padding */
  m[l >> 5] |= 0x80 << (24 - l % 32);
  m[((l + 64 >> 9) << 4) + 15] = l;
  for (var i = 0; i < m.length; i += 16) {
    a = HASH[0]; b = HASH[1]; c = HASH[2]; d = HASH[3]; e = HASH[4]; f = HASH[5]; g = HASH[6]; h = HASH[7];
    for (var j = 0; j < 64; j++) {
      if (j < 16) {
        W[j] = m[j + i];
      } else {
        W[j] = safe_add(safe_add(safe_add(Gamma1256(W[j - 2]), W[j - 7]), Gamma0256(W[j - 15])), W[j - 16]);
      }
      T1 = safe_add(safe_add(safe_add(safe_add(h, Sigma1256(e)), Ch(e, f, g)), K[j]), W[j]);
      T2 = safe_add(Sigma0256(a), Maj(a, b, c));
      h = g; g = f; f = e; e = safe_add(d, T1); d = c; c = b; b = a; a = safe_add(T1, T2);
    }
    HASH[0] = safe_add(a, HASH[0]); HASH[1] = safe_add(b, HASH[1]); HASH[2] = safe_add(c, HASH[2]); HASH[3] = safe_add(d, HASH[3]);
    HASH[4] = safe_add(e, HASH[4]); HASH[5] = safe_add(f, HASH[5]); HASH[6] = safe_add(g, HASH[6]); HASH[7] = safe_add(h, HASH[7]);
  }
  return HASH;
};

module.exports = function sha256(buf) {
  return helpers.hash(buf, core_sha256, 32, true);
};
})
},{"./helpers":27,"tribe/client/enhancedDebug":97}],33:[function(require,module,exports){
require("tribe/client/enhancedDebug").execute("// shim for using process in browser\n\nvar process = module.exports = {};\n\nprocess.nextTick = (function () {\n    var canSetImmediate = typeof window !== 'undefined'\n    && window.setImmediate;\n    var canPost = typeof window !== 'undefined'\n    && window.postMessage && window.addEventListener\n    ;\n\n    if (canSetImmediate) {\n        return function (f) { return window.setImmediate(f) };\n    }\n\n    if (canPost) {\n        var queue = [];\n        window.addEventListener('message', function (ev) {\n            var source = ev.source;\n            if ((source === window || source === null) && ev.data === 'process-tick') {\n                ev.stopPropagation();\n                if (queue.length > 0) {\n                    var fn = queue.shift();\n                    fn();\n                }\n            }\n        }, true);\n\n        return function nextTick(fn) {\n            queue.push(fn);\n            window.postMessage('process-tick', '*');\n        };\n    }\n\n    return function nextTick(fn) {\n        setTimeout(fn, 0);\n    };\n})();\n\nprocess.title = 'browser';\nprocess.browser = true;\nprocess.env = {};\nprocess.argv = [];\n\nfunction noop() {}\n\nprocess.on = noop;\nprocess.once = noop;\nprocess.off = noop;\nprocess.emit = noop;\n\nprocess.binding = function (name) {\n    throw new Error('process.binding is not supported');\n}\n\n// TODO(shtylman)\nprocess.cwd = function () { return '/' };\nprocess.chdir = function (dir) {\n    throw new Error('process.chdir is not supported');\n};\n\n//@ sourceURL=http://tribe//node_modules/browserify/node_modules/insert-module-globals/node_modules/process/browser.js\n", arguments, window, require, module, exports);
(function () {// shim for using process in browser

var process = module.exports = {};

process.nextTick = (function () {
    var canSetImmediate = typeof window !== 'undefined'
    && window.setImmediate;
    var canPost = typeof window !== 'undefined'
    && window.postMessage && window.addEventListener
    ;

    if (canSetImmediate) {
        return function (f) { return window.setImmediate(f) };
    }

    if (canPost) {
        var queue = [];
        window.addEventListener('message', function (ev) {
            var source = ev.source;
            if ((source === window || source === null) && ev.data === 'process-tick') {
                ev.stopPropagation();
                if (queue.length > 0) {
                    var fn = queue.shift();
                    fn();
                }
            }
        }, true);

        return function nextTick(fn) {
            queue.push(fn);
            window.postMessage('process-tick', '*');
        };
    }

    return function nextTick(fn) {
        setTimeout(fn, 0);
    };
})();

process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];

function noop() {}

process.on = noop;
process.once = noop;
process.off = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
}

// TODO(shtylman)
process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
})
},{"tribe/client/enhancedDebug":97}],34:[function(require,module,exports){
require("tribe/client/enhancedDebug").execute("var queue = require('./queue'),\n    types = require('./types'),\n    definitions = {};\n\nmodule.exports = {\n    queue: queue,\n    register: types.register\n};\n\n\n//@ sourceURL=http://app/node_modules/actions/index.js\n", arguments, window, require, module, exports);
(function () {var queue = require('./queue'),
    types = require('./types'),
    definitions = {};

module.exports = {
    queue: queue,
    register: types.register
};

})
},{"./queue":35,"./types":37,"tribe/client/enhancedDebug":97}],35:[function(require,module,exports){
require("tribe/client/enhancedDebug").execute("var behaviours = require('behaviours'),\n    timeout = require('utilities/timeout'),\n    Q = require('q');\n\nmodule.exports = function (pubsub, object, queueType, getNextAction) {\n    var queue = {\n        push: function (action, options) {\n            var types = require('./types');\n\n            if (object.currentAction)\n                object.nextAction = { action: action, options: options };\n            else\n                executeAction(action, options);\n\n            function executeAction(action, options) {\n                var definition = types[action],\n                    topic = 'action.' + (queueType || 'execute') + '.' + action,\n                    data = { objectId: object.id, action: action, options: options };\n\n                pubsub.publish(topic, data);\n\n                object.currentAction = { action: action, options: options, complete: timeoutFor(definition, object) };\n                Q.when(object.currentAction.complete).then(executeNextAction);\n            }\n\n            function executeNextAction() {\n                object.currentAction = undefined;\n\n                var nextAction = determineNextAction();\n                if (nextAction) {\n                    executeAction(nextAction.action, nextAction.options);\n                    object.nextAction = undefined;\n                }\n            }\n\n            function determineNextAction() {\n                if (object.nextAction === false) return false;\n                return object.nextAction ||\n                    (getNextAction && getNextAction()) ||\n                    (object.behaviours && object.behaviours.nextAction());\n            }\n        },\n        pushNext: function () {\n            var action = object.nextAction || object.behaviours.nextAction();\n            if (action)\n                queue.push(object, action.action, action.options);\n        }\n    };\n    return queue;\n};\n\nfunction timeoutFor(definition, object) {\n    if(definition && definition.delay) {\n        var delay = definition.delay;\n        if(definition.delay.constructor === Function)\n            delay = definition.delay(object)\n        return timeout(delay);\n    }\n}\n//@ sourceURL=http://app/node_modules/actions/queue.js\n", arguments, window, require, module, exports);
(function () {var behaviours = require('behaviours'),
    timeout = require('utilities/timeout'),
    Q = require('q');

module.exports = function (pubsub, object, queueType, getNextAction) {
    var queue = {
        push: function (action, options) {
            var types = require('./types');

            if (object.currentAction)
                object.nextAction = { action: action, options: options };
            else
                executeAction(action, options);

            function executeAction(action, options) {
                var definition = types[action],
                    topic = 'action.' + (queueType || 'execute') + '.' + action,
                    data = { objectId: object.id, action: action, options: options };

                pubsub.publish(topic, data);

                object.currentAction = { action: action, options: options, complete: timeoutFor(definition, object) };
                Q.when(object.currentAction.complete).then(executeNextAction);
            }

            function executeNextAction() {
                object.currentAction = undefined;

                var nextAction = determineNextAction();
                if (nextAction) {
                    executeAction(nextAction.action, nextAction.options);
                    object.nextAction = undefined;
                }
            }

            function determineNextAction() {
                if (object.nextAction === false) return false;
                return object.nextAction ||
                    (getNextAction && getNextAction()) ||
                    (object.behaviours && object.behaviours.nextAction());
            }
        },
        pushNext: function () {
            var action = object.nextAction || object.behaviours.nextAction();
            if (action)
                queue.push(object, action.action, action.options);
        }
    };
    return queue;
};

function timeoutFor(definition, object) {
    if(definition && definition.delay) {
        var delay = definition.delay;
        if(definition.delay.constructor === Function)
            delay = definition.delay(object)
        return timeout(delay);
    }
}})
},{"./types":37,"behaviours":42,"q":79,"tribe/client/enhancedDebug":97,"utilities/timeout":96}],36:[function(require,module,exports){
require("tribe/client/enhancedDebug").execute("module.exports = {\n    delay: function (object) {\n        //return (object && object.attributes && object.attributes.speed && (1000 / object.attributes.speed)) || 200;\n        return 1000;\n    }\n};\n//@ sourceURL=http://app/node_modules/actions/types/attack.js\n", arguments, window, require, module, exports);
(function () {module.exports = {
    delay: function (object) {
        //return (object && object.attributes && object.attributes.speed && (1000 / object.attributes.speed)) || 200;
        return 1000;
    }
};})
},{"tribe/client/enhancedDebug":97}],37:[function(require,module,exports){
require("tribe/client/enhancedDebug").execute("module.exports = {\n    register: function (name, definition) {\n        module.exports[name] = definition;\n    }\n};\n\nmodule.exports.register('move', require('./move'));\nmodule.exports.register('attack', require('./attack'));\n\n//@ sourceURL=http://app/node_modules/actions/types/index.js\n", arguments, window, require, module, exports);
(function () {module.exports = {
    register: function (name, definition) {
        module.exports[name] = definition;
    }
};

module.exports.register('move', require('./move'));
module.exports.register('attack', require('./attack'));
})
},{"./attack":36,"./move":38,"tribe/client/enhancedDebug":97}],38:[function(require,module,exports){
require("tribe/client/enhancedDebug").execute("module.exports = {\n    delay: function (object) {\n        return (object && object.attributes && object.attributes.speed && (1000 / object.attributes.speed())) || 200;\n    }\n};\n//@ sourceURL=http://app/node_modules/actions/types/move.js\n", arguments, window, require, module, exports);
(function () {module.exports = {
    delay: function (object) {
        return (object && object.attributes && object.attributes.speed && (1000 / object.attributes.speed())) || 200;
    }
};})
},{"tribe/client/enhancedDebug":97}],39:[function(require,module,exports){
require("tribe/client/enhancedDebug").execute("module.exports = {\n    observables: require('./observables'),\n    visibility: require('./visibility')\n}\n//@ sourceURL=http://app/node_modules/behaviours/helpers/index.js\n", arguments, window, require, module, exports);
(function () {module.exports = {
    observables: require('./observables'),
    visibility: require('./visibility')
}})
},{"./observables":40,"./visibility":41,"tribe/client/enhancedDebug":97}],40:[function(require,module,exports){
require("tribe/client/enhancedDebug").execute("var _ = require('underscore');\n\nmodule.exports = {\n    lifetime: function () {\n        var subscriptions = {};\n\n        return {\n            subscribe: function (observable, callback) {\n                return subscriptions[observable] = observable.subscribe(callback);\n            },\n            arraySubscribe: function (observable, callbacks) {\n                return subscriptions[observable] = observable.subscribe(function (changes) {\n                    _.each(changes, function (change) {\n                        var callback = callbacks[change.status];\n                        callback && callback(change.value, change.index, observable);\n                    });\n                }, null, 'arrayChange');\n            },\n            unsubscribe: function (observable) {\n                subscriptions[observable].dispose();\n                delete subscriptions[observable];\n            },\n            end: function () {\n                _.invoke(subscriptions, 'dispose');\n                subscriptions = {};\n            }\n        };\n    }\n}\n//@ sourceURL=http://app/node_modules/behaviours/helpers/observables.js\n", arguments, window, require, module, exports);
(function () {var _ = require('underscore');

module.exports = {
    lifetime: function () {
        var subscriptions = {};

        return {
            subscribe: function (observable, callback) {
                return subscriptions[observable] = observable.subscribe(callback);
            },
            arraySubscribe: function (observable, callbacks) {
                return subscriptions[observable] = observable.subscribe(function (changes) {
                    _.each(changes, function (change) {
                        var callback = callbacks[change.status];
                        callback && callback(change.value, change.index, observable);
                    });
                }, null, 'arrayChange');
            },
            unsubscribe: function (observable) {
                subscriptions[observable].dispose();
                delete subscriptions[observable];
            },
            end: function () {
                _.invoke(subscriptions, 'dispose');
                subscriptions = {};
            }
        };
    }
}})
},{"tribe/client/enhancedDebug":97,"underscore":87}],41:[function(require,module,exports){
require("tribe/client/enhancedDebug").execute("var queries = require('objects/queries'),\n    observables = require('./observables'),\n    _ = require('underscore');\n\nmodule.exports = {\n    subscribe: function (behaviour, criteria) {\n        var object = behaviour.object,\n            results = ko.observableArray(),\n            predicate = queries.predicateFor(criteria),\n            tile, map;\n\n        refreshFromLocation();\n        object.map.subscribe(refreshFromLocation);\n\n        behaviour.pubsub.subscribe('outcome.occupy', function (outcome) {\n            if (map) {\n                var source = map.objects(outcome.sourceId),\n                    target = map.objects(outcome.targetId);\n\n                if (source === object)\n                    refreshFromLocation();\n                else if (predicate(source))\n                    updateObject(source, tile.canSee(target.location()));\n            }\n        });\n\n        behaviour.pubsub.subscribe('outcome.die', function (outcome) {\n            if (map) {\n                var target = map.objects(outcome.targetId);\n                updateObject(target, false);\n            }\n        });\n\n        function refreshFromLocation() {\n            map = object.map();\n            if (map) {\n                tile = map.tile(object.location());\n\n                // implement...\n                var visibleObjects = _.flatten(_.map(tile.data.visibleTiles, function (location) {\n                    var visibleTile = map.tile(location);\n                    return _.filter(visibleTile.objects(), predicate);\n                }));\n\n                _.each(visibleObjects, updateObject);\n            }\n        }\n\n        function updateObject(objectToUpdate, canSee) {\n            if (objectToUpdate === object) return;\n\n            var alreadyVisible = results().indexOf(objectToUpdate) > -1;\n            if (canSee !== false) {\n                if (!alreadyVisible) results.push(objectToUpdate);\n            } else {\n                if (alreadyVisible) results.remove(objectToUpdate);\n            }\n        }\n\n        return results;\n    }\n}\n//@ sourceURL=http://app/node_modules/behaviours/helpers/visibility.js\n", arguments, window, require, module, exports);
(function () {var queries = require('objects/queries'),
    observables = require('./observables'),
    _ = require('underscore');

module.exports = {
    subscribe: function (behaviour, criteria) {
        var object = behaviour.object,
            results = ko.observableArray(),
            predicate = queries.predicateFor(criteria),
            tile, map;

        refreshFromLocation();
        object.map.subscribe(refreshFromLocation);

        behaviour.pubsub.subscribe('outcome.occupy', function (outcome) {
            if (map) {
                var source = map.objects(outcome.sourceId),
                    target = map.objects(outcome.targetId);

                if (source === object)
                    refreshFromLocation();
                else if (predicate(source))
                    updateObject(source, tile.canSee(target.location()));
            }
        });

        behaviour.pubsub.subscribe('outcome.die', function (outcome) {
            if (map) {
                var target = map.objects(outcome.targetId);
                updateObject(target, false);
            }
        });

        function refreshFromLocation() {
            map = object.map();
            if (map) {
                tile = map.tile(object.location());

                // implement...
                var visibleObjects = _.flatten(_.map(tile.data.visibleTiles, function (location) {
                    var visibleTile = map.tile(location);
                    return _.filter(visibleTile.objects(), predicate);
                }));

                _.each(visibleObjects, updateObject);
            }
        }

        function updateObject(objectToUpdate, canSee) {
            if (objectToUpdate === object) return;

            var alreadyVisible = results().indexOf(objectToUpdate) > -1;
            if (canSee !== false) {
                if (!alreadyVisible) results.push(objectToUpdate);
            } else {
                if (alreadyVisible) results.remove(objectToUpdate);
            }
        }

        return results;
    }
}})
},{"./observables":40,"objects/queries":69,"tribe/client/enhancedDebug":97,"underscore":87}],42:[function(require,module,exports){
require("tribe/client/enhancedDebug").execute("var helpers = require('./helpers'),\n    pubsub = require('tribe').pubsub,\n    _ = require('underscore'),\n    definitions = {};\n\nmodule.exports = {\n    register: function (name, definition) {\n        definitions[name] = definition;\n    },\n    forObject: function (object) {\n        var behaviours = [],\n            observables = helpers.observables.lifetime(),\n            lifetime = pubsub.createLifetime(),\n            api = {\n                attachExisting: function () {\n                    _.each(object.data.behaviours, attachBehaviour);\n                },\n                attach: function (name, options, data) {\n                    var behaviourData = { name: name, options: options, data: data };\n                    object.data.behaviours.push(behaviourData);\n                    attachBehaviour(behaviourData);\n                },\n                queueNext: function () {\n                    object.queue.pushNext();\n                },\n                nextAction: function () {\n                    for (var i = 0, l = behaviours.length; i < l; i++) {\n                        var action = behaviours[i].action();\n                        if (action) return action;\n                    }\n                },\n                end: function () {\n                    object.data.behaviours = [];\n                    lifetime.end();\n                    observables.end();\n                    _.each(behaviours, function (behaviour) {\n                        behaviour.detach && behaviour.detach();\n                    });\n                }\n            };\n\n        return api;\n\n        function attachBehaviour(data) {\n            data.data = data.data || {};\n\n            var definition = definitions[data.name],\n                behaviourApi = {\n                    object: object,\n                    options: data.options,\n                    data: data.data,\n                    pubsub: lifetime,\n                    queueNext: api.queueNext,\n                    observables: observables,\n                    visibleObjects: function (criteria) {\n                        return helpers.visibility.subscribe(behaviourApi, criteria);\n                    }\n                },\n                behaviour = definition(behaviourApi);\n\n            behaviours.push(behaviour);\n            behaviour.attach();\n        }\n    }\n};\n\nmodule.exports.register('follow', require('./types/follow'));\nmodule.exports.register('attack', require('./types/attack'));\n\n//@ sourceURL=http://app/node_modules/behaviours/index.js\n", arguments, window, require, module, exports);
(function () {var helpers = require('./helpers'),
    pubsub = require('tribe').pubsub,
    _ = require('underscore'),
    definitions = {};

module.exports = {
    register: function (name, definition) {
        definitions[name] = definition;
    },
    forObject: function (object) {
        var behaviours = [],
            observables = helpers.observables.lifetime(),
            lifetime = pubsub.createLifetime(),
            api = {
                attachExisting: function () {
                    _.each(object.data.behaviours, attachBehaviour);
                },
                attach: function (name, options, data) {
                    var behaviourData = { name: name, options: options, data: data };
                    object.data.behaviours.push(behaviourData);
                    attachBehaviour(behaviourData);
                },
                queueNext: function () {
                    object.queue.pushNext();
                },
                nextAction: function () {
                    for (var i = 0, l = behaviours.length; i < l; i++) {
                        var action = behaviours[i].action();
                        if (action) return action;
                    }
                },
                end: function () {
                    object.data.behaviours = [];
                    lifetime.end();
                    observables.end();
                    _.each(behaviours, function (behaviour) {
                        behaviour.detach && behaviour.detach();
                    });
                }
            };

        return api;

        function attachBehaviour(data) {
            data.data = data.data || {};

            var definition = definitions[data.name],
                behaviourApi = {
                    object: object,
                    options: data.options,
                    data: data.data,
                    pubsub: lifetime,
                    queueNext: api.queueNext,
                    observables: observables,
                    visibleObjects: function (criteria) {
                        return helpers.visibility.subscribe(behaviourApi, criteria);
                    }
                },
                behaviour = definition(behaviourApi);

            behaviours.push(behaviour);
            behaviour.attach();
        }
    }
};

module.exports.register('follow', require('./types/follow'));
module.exports.register('attack', require('./types/attack'));
})
},{"./helpers":39,"./types/attack":43,"./types/follow":44,"tribe":"truKqQ","tribe/client/enhancedDebug":97,"underscore":87}],43:[function(require,module,exports){
require("tribe/client/enhancedDebug").execute("var location = require('utilities/location');\n\nmodule.exports = function (behaviour) {\n    var object = behaviour.object,\n        options = behaviour.options,\n\n        visibleObjects;\n    \n    return {\n        attach: function () {\n            visibleObjects = behaviour.visibleObjects(options.criteria);\n            behaviour.observables.subscribe(visibleObjects, behaviour.queueNext);\n        },\n        action: function () {\n            if (visibleObjects && visibleObjects().length > 0) {\n                var target = visibleObjects()[0];\n\n                if (location.distance(object.location(), target.location()) > 1.5)\n                    return { action: 'move', objectId: object.id, options: { location: location.moveTowards(object, target.location(), object.map()) } };\n                return { action: 'attack', objectId: object.id, options: { location: target.location() } };\n            }\n        }\n    };\n};\n//@ sourceURL=http://app/node_modules/behaviours/types/attack.js\n", arguments, window, require, module, exports);
(function () {var location = require('utilities/location');

module.exports = function (behaviour) {
    var object = behaviour.object,
        options = behaviour.options,

        visibleObjects;
    
    return {
        attach: function () {
            visibleObjects = behaviour.visibleObjects(options.criteria);
            behaviour.observables.subscribe(visibleObjects, behaviour.queueNext);
        },
        action: function () {
            if (visibleObjects && visibleObjects().length > 0) {
                var target = visibleObjects()[0];

                if (location.distance(object.location(), target.location()) > 1.5)
                    return { action: 'move', objectId: object.id, options: { location: location.moveTowards(object, target.location(), object.map()) } };
                return { action: 'attack', objectId: object.id, options: { location: target.location() } };
            }
        }
    };
};})
},{"tribe/client/enhancedDebug":97,"utilities/location":89}],44:[function(require,module,exports){
require("tribe/client/enhancedDebug").execute("var location = require('utilities/location');\n\nmodule.exports = function (behaviour) {\n    var object = behaviour.object,\n        options = behaviour.options,\n        targetVisible = behaviour.data.visibleObjects = [];\n\n    return {\n        attach: function () {\n            var map = object.map(),\n                target = map.objects(options.targetId);\n            behaviour.observables.subscribe(target.location, behaviour.queueNext);\n        },\n\n        action: function () {\n            var map = object.map(),\n                target = map.objects(options.targetId),\n                distance = options.distance;\n\n            if (map.tile(object.location()).canSee(target.location()) &&\n                location.distance(object.location(), target.location()) > distance)\n\n                return { action: 'move', objectId: object.id, options: { location: location.moveTowards(object, target.location(), map) } };\n        }\n    };\n};\n//@ sourceURL=http://app/node_modules/behaviours/types/follow.js\n", arguments, window, require, module, exports);
(function () {var location = require('utilities/location');

module.exports = function (behaviour) {
    var object = behaviour.object,
        options = behaviour.options,
        targetVisible = behaviour.data.visibleObjects = [];

    return {
        attach: function () {
            var map = object.map(),
                target = map.objects(options.targetId);
            behaviour.observables.subscribe(target.location, behaviour.queueNext);
        },

        action: function () {
            var map = object.map(),
                target = map.objects(options.targetId),
                distance = options.distance;

            if (map.tile(object.location()).canSee(target.location()) &&
                location.distance(object.location(), target.location()) > distance)

                return { action: 'move', objectId: object.id, options: { location: location.moveTowards(object, target.location(), map) } };
        }
    };
};})
},{"tribe/client/enhancedDebug":97,"utilities/location":89}],45:[function(require,module,exports){
require("tribe/client/enhancedDebug").execute("var actions = require('actions'),\n    maps = require('maps'),\n    objects = require('objects'),\n    mapFactory = require('maps/factories/basic'),\n    _ = require('underscore');\n\nmodule.exports = {\n    load: function (data) {\n        var game = createGame(maps.load(data.map), data.playerId);\n        game.attachBehaviours();\n        return game;\n    },\n    create: function (map) {\n        var game = createGame(map || mapFactory());\n        game.addPlayer();\n        return game;\n    }\n};\n\nfunction createGame(map, playerId) {\n    var game = {\n        map: map,\n        data: {\n            map: map.data,\n            playerId: playerId\n        },\n        player: playerId && map.objects(playerId),\n        executeAction: executeAction,\n        addPlayer: addPlayer,\n        attachBehaviours: attachBehaviours\n    };\n    return game;\n\n    function executeAction(object, action, options) {\n        var interactions = require('interactions'),\n            targets;\n\n        if (options) {\n            if (options.location)\n                targets = game.map.tile(options.location).objects();\n            else if (options.targetId)\n                targets = [game.map.objects(options.targetId)];\n        }\n\n        // validate\n\n        if (targets)\n            interactions.trigger(action, object, targets, options);\n    }\n\n    function addPlayer() {\n        var player = game.player = objects.create('human'),\n            pet = objects.create('dog');\n\n        game.data.playerId = player.id;\n\n        map.addObject(player, 8, 7)\n           .addObject(pet, 8, 6);\n\n        pet.behaviours.attach('attack', { criteria: { friendly: false } });\n        pet.behaviours.attach('follow', { targetId: player.id, distance: 2 });\n    }\n\n    function attachBehaviours() {\n        _.each(game.map.objects.all(), function (object) {\n            object.behaviours.attachExisting();\n        });\n    }\n}\n\n//@ sourceURL=http://app/node_modules/game.js\n", arguments, window, require, module, exports);
(function () {var actions = require('actions'),
    maps = require('maps'),
    objects = require('objects'),
    mapFactory = require('maps/factories/basic'),
    _ = require('underscore');

module.exports = {
    load: function (data) {
        var game = createGame(maps.load(data.map), data.playerId);
        game.attachBehaviours();
        return game;
    },
    create: function (map) {
        var game = createGame(map || mapFactory());
        game.addPlayer();
        return game;
    }
};

function createGame(map, playerId) {
    var game = {
        map: map,
        data: {
            map: map.data,
            playerId: playerId
        },
        player: playerId && map.objects(playerId),
        executeAction: executeAction,
        addPlayer: addPlayer,
        attachBehaviours: attachBehaviours
    };
    return game;

    function executeAction(object, action, options) {
        var interactions = require('interactions'),
            targets;

        if (options) {
            if (options.location)
                targets = game.map.tile(options.location).objects();
            else if (options.targetId)
                targets = [game.map.objects(options.targetId)];
        }

        // validate

        if (targets)
            interactions.trigger(action, object, targets, options);
    }

    function addPlayer() {
        var player = game.player = objects.create('human'),
            pet = objects.create('dog');

        game.data.playerId = player.id;

        map.addObject(player, 8, 7)
           .addObject(pet, 8, 6);

        pet.behaviours.attach('attack', { criteria: { friendly: false } });
        pet.behaviours.attach('follow', { targetId: player.id, distance: 2 });
    }

    function attachBehaviours() {
        _.each(game.map.objects.all(), function (object) {
            object.behaviours.attachExisting();
        });
    }
}
})
},{"actions":34,"interactions":46,"maps":58,"maps/factories/basic":57,"objects":67,"tribe/client/enhancedDebug":97,"underscore":87}],46:[function(require,module,exports){
require("tribe/client/enhancedDebug").execute("var _ = require('underscore');\n\n// dependencies for individual methods are in each method, enables stubbing out easily.\n\nvar interactions = module.exports = {\n    trigger: function (action, source, targets, options) {\n        var pubsub = require('tribe').pubsub,\n\n            outcomes = interactions.outcomesFor(action, source, targets, options);\n\n        if(outcomes && outcomes.length > 0)\n            _.each(outcomes, function (outcome) {\n                pubsub.publish('outcome.' + outcome.name, outcome);\n            });\n    },\n    outcomesFor: function (action, source, targets, options) {\n        var interactionRepository = require('./types'),\n\n            outcomes = [];\n\n        // process object stack from top to bottom\n        _.find(targets.concat().reverse(), function (target) {\n            var interaction = target.data.interactions && target.data.interactions[action];\n\n            if (interaction !== undefined && interaction !== null) {\n                if(interaction === false)\n                    return true; // break out of find\n                else if (interaction.constructor === String)\n                    outcomes.push.apply(outcomes, interactionRepository.apply(interaction, source, target, options));\n                else if (interaction.constructor === Function)\n                    throw new Error('Not implemented!');\n                else if (interaction.outcome) {\n                    outcomes.push(outcomeFromObjectDefinition(interaction));\n                }\n                else if (interaction.outcomes) {\n                    _.each(interaction.outcomes, function (definition) {\n                        outcomes.push(outcomeFromObjectDefinition(definition));\n                    });\n                }\n            }\n\n            function outcomeFromObjectDefinition(definition) {\n                var outcomeOptions = ((definition.options && definition.options.constructor === Function) ? definition.options() : definition.options) || options;\n\n                return {\n                    name: definition.outcome,\n                    sourceId: definition.applyToSource ? target.id : source.id,\n                    targetId: definition.applyToSource ? source.id : target.id,\n                    location: definition.applyToSource ? source.location() : target.location(),\n                    options: outcomeOptions\n                };\n            }\n        });\n        return outcomes;\n    },\n    applyOutcome: function (name, source, target, options, game) {    \n        var outcomeRepository = require('./outcomes');\n\n        outcomeRepository.apply(name, source, target, options, game);\n    }\n};\n\n//@ sourceURL=http://app/node_modules/interactions/index.js\n", arguments, window, require, module, exports);
(function () {var _ = require('underscore');

// dependencies for individual methods are in each method, enables stubbing out easily.

var interactions = module.exports = {
    trigger: function (action, source, targets, options) {
        var pubsub = require('tribe').pubsub,

            outcomes = interactions.outcomesFor(action, source, targets, options);

        if(outcomes && outcomes.length > 0)
            _.each(outcomes, function (outcome) {
                pubsub.publish('outcome.' + outcome.name, outcome);
            });
    },
    outcomesFor: function (action, source, targets, options) {
        var interactionRepository = require('./types'),

            outcomes = [];

        // process object stack from top to bottom
        _.find(targets.concat().reverse(), function (target) {
            var interaction = target.data.interactions && target.data.interactions[action];

            if (interaction !== undefined && interaction !== null) {
                if(interaction === false)
                    return true; // break out of find
                else if (interaction.constructor === String)
                    outcomes.push.apply(outcomes, interactionRepository.apply(interaction, source, target, options));
                else if (interaction.constructor === Function)
                    throw new Error('Not implemented!');
                else if (interaction.outcome) {
                    outcomes.push(outcomeFromObjectDefinition(interaction));
                }
                else if (interaction.outcomes) {
                    _.each(interaction.outcomes, function (definition) {
                        outcomes.push(outcomeFromObjectDefinition(definition));
                    });
                }
            }

            function outcomeFromObjectDefinition(definition) {
                var outcomeOptions = ((definition.options && definition.options.constructor === Function) ? definition.options() : definition.options) || options;

                return {
                    name: definition.outcome,
                    sourceId: definition.applyToSource ? target.id : source.id,
                    targetId: definition.applyToSource ? source.id : target.id,
                    location: definition.applyToSource ? source.location() : target.location(),
                    options: outcomeOptions
                };
            }
        });
        return outcomes;
    },
    applyOutcome: function (name, source, target, options, game) {    
        var outcomeRepository = require('./outcomes');

        outcomeRepository.apply(name, source, target, options, game);
    }
};
})
},{"./outcomes":52,"./types":55,"tribe":"truKqQ","tribe/client/enhancedDebug":97,"underscore":87}],47:[function(require,module,exports){
require("tribe/client/enhancedDebug").execute("var pubsub = require('tribe').pubsub;\n\nmodule.exports = function (source, target, options, game) {\n    game.map.tile(target.location()).remove(target);\n    source.inventory.add(target);\n\n    if (source === game.player)\n        pubsub.publish('ui.message', { text: 'You pick up the ' + target.type });\n};\n//@ sourceURL=http://app/node_modules/interactions/outcomes/acquire.js\n", arguments, window, require, module, exports);
(function () {var pubsub = require('tribe').pubsub;

module.exports = function (source, target, options, game) {
    game.map.tile(target.location()).remove(target);
    source.inventory.add(target);

    if (source === game.player)
        pubsub.publish('ui.message', { text: 'You pick up the ' + target.type });
};})
},{"tribe":"truKqQ","tribe/client/enhancedDebug":97}],48:[function(require,module,exports){
require("tribe/client/enhancedDebug").execute("module.exports = function (source, target, options, game) {\n    var health = target.attributes.health,\n        maxHealth = target.attributes.maxHealth(),\n        targetHealth = health() - options.value;\n\n    if (targetHealth > maxHealth)\n        targetHealth = maxHealth;\n\n    health(targetHealth);\n};\n//@ sourceURL=http://app/node_modules/interactions/outcomes/damage.js\n", arguments, window, require, module, exports);
(function () {module.exports = function (source, target, options, game) {
    var health = target.attributes.health,
        maxHealth = target.attributes.maxHealth(),
        targetHealth = health() - options.value;

    if (targetHealth > maxHealth)
        targetHealth = maxHealth;

    health(targetHealth);
};})
},{"tribe/client/enhancedDebug":97}],49:[function(require,module,exports){
require("tribe/client/enhancedDebug").execute("module.exports = function (source, target, options, game) {\n    game.map.removeObject(target);\n};\n//@ sourceURL=http://app/node_modules/interactions/outcomes/destroy.js\n", arguments, window, require, module, exports);
(function () {module.exports = function (source, target, options, game) {
    game.map.removeObject(target);
};})
},{"tribe/client/enhancedDebug":97}],50:[function(require,module,exports){
require("tribe/client/enhancedDebug").execute("var objects = require('objects'),\n    pubsub = require('tribe').pubsub\n    _ = require('underscore');\n\nmodule.exports = function (source, target, options, game) {\n    var inventory = target.inventory,\n        tile = game.map.tile(target.location());\n\n    _.each(inventory.items().concat(), function (object) {\n        inventory.remove(object);\n        tile.add(object);\n    });\n\n    if (inventory.gold() > 0) {\n        game.map.addObject(objects.create('gold', { quantity: inventory.gold() }), target.location());\n        inventory.gold(0);\n    }\n\n    target.die();\n    game.map.removeObject(target);\n\n    pubsub.publish('ui.message', { text: 'The ' + target.type + ' dies.' });\n};\n//@ sourceURL=http://app/node_modules/interactions/outcomes/die.js\n", arguments, window, require, module, exports);
(function () {var objects = require('objects'),
    pubsub = require('tribe').pubsub
    _ = require('underscore');

module.exports = function (source, target, options, game) {
    var inventory = target.inventory,
        tile = game.map.tile(target.location());

    _.each(inventory.items().concat(), function (object) {
        inventory.remove(object);
        tile.add(object);
    });

    if (inventory.gold() > 0) {
        game.map.addObject(objects.create('gold', { quantity: inventory.gold() }), target.location());
        inventory.gold(0);
    }

    target.die();
    game.map.removeObject(target);

    pubsub.publish('ui.message', { text: 'The ' + target.type + ' dies.' });
};})
},{"objects":67,"tribe":"truKqQ","tribe/client/enhancedDebug":97,"underscore":87}],51:[function(require,module,exports){
require("tribe/client/enhancedDebug").execute("module.exports = function (source, target, options, game) {\n    if (source.inventory.equipped(target.category)() === target)\n        source.inventory.unequip(target.category);\n    else\n        source.inventory.equip(target);\n}\n//@ sourceURL=http://app/node_modules/interactions/outcomes/equip.js\n", arguments, window, require, module, exports);
(function () {module.exports = function (source, target, options, game) {
    if (source.inventory.equipped(target.category)() === target)
        source.inventory.unequip(target.category);
    else
        source.inventory.equip(target);
}})
},{"tribe/client/enhancedDebug":97}],52:[function(require,module,exports){
require("tribe/client/enhancedDebug").execute("var outcomes = {};\n\nmodule.exports = {\n    register: function (name, outcome) {\n        outcomes[name] = outcome;\n    },\n    apply: function (name, source, target, options, game) {\n        outcomes[name](source, target, options, game);\n    }\n};\n\n// this forces browserify to include the modules by explicitly requiring them\n// should implement something in tribe that allows an entire directory to be included\nmodule.exports.register('acquire', require('./acquire'));\nmodule.exports.register('damage', require('./damage'));\nmodule.exports.register('destroy', require('./destroy'));\nmodule.exports.register('die', require('./die'));\nmodule.exports.register('equip', require('./equip'));\nmodule.exports.register('occupy', require('./occupy'));\n\n//@ sourceURL=http://app/node_modules/interactions/outcomes/index.js\n", arguments, window, require, module, exports);
(function () {var outcomes = {};

module.exports = {
    register: function (name, outcome) {
        outcomes[name] = outcome;
    },
    apply: function (name, source, target, options, game) {
        outcomes[name](source, target, options, game);
    }
};

// this forces browserify to include the modules by explicitly requiring them
// should implement something in tribe that allows an entire directory to be included
module.exports.register('acquire', require('./acquire'));
module.exports.register('damage', require('./damage'));
module.exports.register('destroy', require('./destroy'));
module.exports.register('die', require('./die'));
module.exports.register('equip', require('./equip'));
module.exports.register('occupy', require('./occupy'));
})
},{"./acquire":47,"./damage":48,"./destroy":49,"./die":50,"./equip":51,"./occupy":53,"tribe/client/enhancedDebug":97}],53:[function(require,module,exports){
require("tribe/client/enhancedDebug").execute("module.exports = function (source, target, options, game) {\n    game.map.move(source, target.location());    \n};\n//@ sourceURL=http://app/node_modules/interactions/outcomes/occupy.js\n", arguments, window, require, module, exports);
(function () {module.exports = function (source, target, options, game) {
    game.map.move(source, target.location());    
};})
},{"tribe/client/enhancedDebug":97}],54:[function(require,module,exports){
require("tribe/client/enhancedDebug").execute("var location = require('utilities/location'),\n    random = require('utilities/random');\n\nmodule.exports = function (source, target, options) {\n    var weapon, value, outcomes = [];\n\n    if (location.distance(source.location(), target.location()) > 1.5) {\n        weapon = source.inventory.equipped('wr')();\n        if (!weapon) return;\n        outcomes.push(outcome('projectile'));\n    } else\n        weapon = source.inventory.equipped('wh')();\n\n    value = damage(weapon);\n    outcomes.push(outcome('damage', { value: value }));\n\n    if(target.attributes.health() < value)\n        outcomes.push(outcome('die'));\n\n    return outcomes;\n\n    function outcome(name, options) {\n        return {\n            name: name,\n            sourceId: source.id,\n            targetId: target.id,\n            location: target.location(),\n            options: options\n        };\n    }\n\n    function damage(weapon) {\n        weapon = weapon || { data: { damage: { min: 1, max: 4 } } };\n\n        var damage = weapon.data.damage;\n\n        return random.range(damage.min, damage.max);\n    }\n};\n\n\n//@ sourceURL=http://app/node_modules/interactions/types/attack.js\n", arguments, window, require, module, exports);
(function () {var location = require('utilities/location'),
    random = require('utilities/random');

module.exports = function (source, target, options) {
    var weapon, value, outcomes = [];

    if (location.distance(source.location(), target.location()) > 1.5) {
        weapon = source.inventory.equipped('wr')();
        if (!weapon) return;
        outcomes.push(outcome('projectile'));
    } else
        weapon = source.inventory.equipped('wh')();

    value = damage(weapon);
    outcomes.push(outcome('damage', { value: value }));

    if(target.attributes.health() < value)
        outcomes.push(outcome('die'));

    return outcomes;

    function outcome(name, options) {
        return {
            name: name,
            sourceId: source.id,
            targetId: target.id,
            location: target.location(),
            options: options
        };
    }

    function damage(weapon) {
        weapon = weapon || { data: { damage: { min: 1, max: 4 } } };

        var damage = weapon.data.damage;

        return random.range(damage.min, damage.max);
    }
};

})
},{"tribe/client/enhancedDebug":97,"utilities/location":89,"utilities/random":95}],55:[function(require,module,exports){
require("tribe/client/enhancedDebug").execute("var _ = require('underscore'),\n    definitions = {};\n\nvar behaviours = module.exports = {\n    register: function (name, definition) {\n        definitions[name] = definition;\n    },\n    apply: function (name, source, target, options) {\n        return definitions[name](source, target, options);\n    }\n};\n\nmodule.exports.register('attack', require('./attack'));\n\n//@ sourceURL=http://app/node_modules/interactions/types/index.js\n", arguments, window, require, module, exports);
(function () {var _ = require('underscore'),
    definitions = {};

var behaviours = module.exports = {
    register: function (name, definition) {
        definitions[name] = definition;
    },
    apply: function (name, source, target, options) {
        return definitions[name](source, target, options);
    }
};

module.exports.register('attack', require('./attack'));
})
},{"./attack":54,"tribe/client/enhancedDebug":97,"underscore":87}],56:[function(require,module,exports){
require("tribe/client/enhancedDebug").execute("var objects = require('objects'),\n    passage = require('./passage'),\n    tiles = require('./tiles');\n\nmodule.exports = function (map) {\n    return {\n        object: function (o) {\n            var object = objects.create(o.type, o.options);\n            map.addObject(object, o.row, o.col);\n            return map;\n        },\n\n        room: function (o) {\n            for(var row = o.top; row < o.top + o.height; row++)\n                for (var col = o.left; col < o.left + o.width; col++) {\n                    var object = (row === o.top || row === o.top + o.height - 1 || col === o.left || col === o.left + o.width - 1)\n                        ? objects.create('wall') : objects.create('floor');\n                    map.addObject(object, row, col);\n                }\n            return map;\n        },\n\n        passage: function (o) {\n            var width = o.end.col - o.start.col,\n                height = o.end.row - o.start.row,\n                horizontal = Math.abs(width) > Math.abs(height);\n\n            if(horizontal)\n                passage(map)\n                    .start(o.start.row, o.start.col)\n                    .horizontal(Math.floor(width / 2))\n                    .vertical(height)\n                    .horizontal(Math.ceil(width / 2));\n            else\n                passage(map)\n                    .start(o.start.row, o.start.col)\n                    .vertical(Math.floor(height / 2))\n                    .horizontal(width)\n                    .vertical(Math.ceil(height / 2));\n            return map;\n        }\n    };\n}\n//@ sourceURL=http://app/node_modules/maps/create.js\n", arguments, window, require, module, exports);
(function () {var objects = require('objects'),
    passage = require('./passage'),
    tiles = require('./tiles');

module.exports = function (map) {
    return {
        object: function (o) {
            var object = objects.create(o.type, o.options);
            map.addObject(object, o.row, o.col);
            return map;
        },

        room: function (o) {
            for(var row = o.top; row < o.top + o.height; row++)
                for (var col = o.left; col < o.left + o.width; col++) {
                    var object = (row === o.top || row === o.top + o.height - 1 || col === o.left || col === o.left + o.width - 1)
                        ? objects.create('wall') : objects.create('floor');
                    map.addObject(object, row, col);
                }
            return map;
        },

        passage: function (o) {
            var width = o.end.col - o.start.col,
                height = o.end.row - o.start.row,
                horizontal = Math.abs(width) > Math.abs(height);

            if(horizontal)
                passage(map)
                    .start(o.start.row, o.start.col)
                    .horizontal(Math.floor(width / 2))
                    .vertical(height)
                    .horizontal(Math.ceil(width / 2));
            else
                passage(map)
                    .start(o.start.row, o.start.col)
                    .vertical(Math.floor(height / 2))
                    .horizontal(width)
                    .vertical(Math.ceil(height / 2));
            return map;
        }
    };
}})
},{"./passage":60,"./tiles":61,"objects":67,"tribe/client/enhancedDebug":97}],57:[function(require,module,exports){
require("tribe/client/enhancedDebug").execute("var maps = require('maps');\n\nmodule.exports = function () {\n    return maps.create({ width: 55, height: 30 })\n\n        .create.room({ top: 5, left: 5, width: 8, height: 6 })\n        .create.room({ top: 17, left: 30, width: 10, height: 6 })\n        .create.room({ top: 20, left: 6, width: 10, height: 6 })\n        .create.passage({ start: { row: 8, col: 12 }, end: { row: 18, col: 30 } })\n        .create.passage({ start: { row: 10, col: 7 }, end: { row: 21, col: 7 } })\n        .create.object({ type: 'gold', row: 8, col: 6, options: { quantity: 100 } })\n        .create.object({ type: 'long sword', row: 8, col: 6 })\n        .create.object({ type: 'healing potion', row: 7, col: 7 })\n        .create.object({ type: 'plate mail', row: 8, col: 6 })\n        .create.object({ type: 'bow', row: 8, col: 6 })\n        .create.object({ type: 'orc', row: 19, col: 32 })\n        .create.object({ type: 'orc', row: 20, col: 37 })\n\n        .create.room({ top: 1, left: 16, width: 6, height: 6 })\n        //.create.room({ top: 1, left: 23, width: 6, height: 6 })\n        //.create.room({ top: 1, left: 30, width: 6, height: 6 })\n        //.create.room({ top: 1, left: 37, width: 6, height: 6 })\n        //.create.room({ top: 1, left: 44, width: 6, height: 6 })\n        //.create.room({ top: 10, left: 23, width: 6, height: 6 })\n        //.create.room({ top: 10, left: 30, width: 6, height: 6 })\n        //.create.room({ top: 10, left: 37, width: 6, height: 6 })\n        //.create.room({ top: 10, left: 44, width: 6, height: 6 })\n        .create.passage({ start: { row: 8, col: 12 }, end: { row: 8, col: 18 } }) //46 } })\n        .create.passage({ start: { row: 8, col: 18 }, end: { row: 6, col: 18 } })\n        //.create.passage({ start: { row: 8, col: 25 }, end: { row: 6, col: 25 } })\n        //.create.passage({ start: { row: 8, col: 32 }, end: { row: 6, col: 32 } })\n        //.create.passage({ start: { row: 8, col: 39 }, end: { row: 6, col: 39 } })\n        //.create.passage({ start: { row: 8, col: 46 }, end: { row: 6, col: 46 } })\n        //.create.passage({ start: { row: 8, col: 26 }, end: { row: 10, col: 26 } })\n        //.create.passage({ start: { row: 8, col: 33 }, end: { row: 10, col: 33 } })\n        //.create.passage({ start: { row: 8, col: 40 }, end: { row: 10, col: 40 } })\n        //.create.passage({ start: { row: 8, col: 47 }, end: { row: 10, col: 47 } })\n        .create.object({ type: 'orc', row: 3, col: 18 })\n        //.create.object({ type: 'orc', row: 3, col: 25 })\n        //.create.object({ type: 'orc', row: 3, col: 32 })\n        //.create.object({ type: 'orc', row: 3, col: 39 })\n        //.create.object({ type: 'orc', row: 3, col: 46 })\n        //.create.object({ type: 'orc', row: 12, col: 26 })\n        //.create.object({ type: 'orc', row: 12, col: 33 })\n        //.create.object({ type: 'orc', row: 12, col: 40 })\n        //.create.object({ type: 'orc', row: 12, col: 47 })\n\n        .updateVisibility();\n};\n//@ sourceURL=http://app/node_modules/maps/factories/basic.js\n", arguments, window, require, module, exports);
(function () {var maps = require('maps');

module.exports = function () {
    return maps.create({ width: 55, height: 30 })

        .create.room({ top: 5, left: 5, width: 8, height: 6 })
        .create.room({ top: 17, left: 30, width: 10, height: 6 })
        .create.room({ top: 20, left: 6, width: 10, height: 6 })
        .create.passage({ start: { row: 8, col: 12 }, end: { row: 18, col: 30 } })
        .create.passage({ start: { row: 10, col: 7 }, end: { row: 21, col: 7 } })
        .create.object({ type: 'gold', row: 8, col: 6, options: { quantity: 100 } })
        .create.object({ type: 'long sword', row: 8, col: 6 })
        .create.object({ type: 'healing potion', row: 7, col: 7 })
        .create.object({ type: 'plate mail', row: 8, col: 6 })
        .create.object({ type: 'bow', row: 8, col: 6 })
        .create.object({ type: 'orc', row: 19, col: 32 })
        .create.object({ type: 'orc', row: 20, col: 37 })

        .create.room({ top: 1, left: 16, width: 6, height: 6 })
        //.create.room({ top: 1, left: 23, width: 6, height: 6 })
        //.create.room({ top: 1, left: 30, width: 6, height: 6 })
        //.create.room({ top: 1, left: 37, width: 6, height: 6 })
        //.create.room({ top: 1, left: 44, width: 6, height: 6 })
        //.create.room({ top: 10, left: 23, width: 6, height: 6 })
        //.create.room({ top: 10, left: 30, width: 6, height: 6 })
        //.create.room({ top: 10, left: 37, width: 6, height: 6 })
        //.create.room({ top: 10, left: 44, width: 6, height: 6 })
        .create.passage({ start: { row: 8, col: 12 }, end: { row: 8, col: 18 } }) //46 } })
        .create.passage({ start: { row: 8, col: 18 }, end: { row: 6, col: 18 } })
        //.create.passage({ start: { row: 8, col: 25 }, end: { row: 6, col: 25 } })
        //.create.passage({ start: { row: 8, col: 32 }, end: { row: 6, col: 32 } })
        //.create.passage({ start: { row: 8, col: 39 }, end: { row: 6, col: 39 } })
        //.create.passage({ start: { row: 8, col: 46 }, end: { row: 6, col: 46 } })
        //.create.passage({ start: { row: 8, col: 26 }, end: { row: 10, col: 26 } })
        //.create.passage({ start: { row: 8, col: 33 }, end: { row: 10, col: 33 } })
        //.create.passage({ start: { row: 8, col: 40 }, end: { row: 10, col: 40 } })
        //.create.passage({ start: { row: 8, col: 47 }, end: { row: 10, col: 47 } })
        .create.object({ type: 'orc', row: 3, col: 18 })
        //.create.object({ type: 'orc', row: 3, col: 25 })
        //.create.object({ type: 'orc', row: 3, col: 32 })
        //.create.object({ type: 'orc', row: 3, col: 39 })
        //.create.object({ type: 'orc', row: 3, col: 46 })
        //.create.object({ type: 'orc', row: 12, col: 26 })
        //.create.object({ type: 'orc', row: 12, col: 33 })
        //.create.object({ type: 'orc', row: 12, col: 40 })
        //.create.object({ type: 'orc', row: 12, col: 47 })

        .updateVisibility();
};})
},{"maps":58,"tribe/client/enhancedDebug":97}],58:[function(require,module,exports){
require("tribe/client/enhancedDebug").execute("var _ = require('underscore')\n    tiles = require('./tiles');\n\nmodule.exports = {\n    load: function(data) {\n        return createMap(data);\n    },\n    create: function(options) {\n        return createMap({ \n            tiles: tiles.createData(options.width, options.height)\n        });\n    }\n};\n\nfunction createMap(data) {\n    var create = require('./create'),\n        move = require('./move'),\n        visibility = require('./visibility'),\n        objects = require('objects'),\n        objectHash = {},\n\n        map = {\n            addObject: function (object, rowOrLocation, col) {\n                var location = normaliseRowCol(rowOrLocation, col);\n                if (location)\n                    map.tile(location).add(object);\n                    \n                object.map(map);\n                objectHash[object.id] = object;\n\n                _.each(object.inventory && object.inventory.items(), function (item) {\n                    map.addObject(item);\n                });\n\n                return map;\n            },\n            removeObject: function (object) {\n                var location = object.location();\n                if (location) {\n                    if(location.row && location.col)\n                        map.tile(location).remove(object);\n                    if (location.container)\n                        map.objects(location.container).inventory.remove(object);\n                }\n                    \n                object.map(null);\n                object.location(null);\n                delete objectHash[object.id];\n\n                _.each(object.inventory && object.inventory.items(), function (item) {\n                    map.removeObject(item);\n                });\n\n                return map;\n            },\n            replaceObject: function (object, replacements) {\n                var location = object.location();\n                map.removeObject(object);\n                _.each(replacements, function (replacement) {\n                    map.addObject(replacement, location.row, location.col);\n                });\n            },\n            updateVisibility: function () {\n                visibility.updateMap(map);\n                return map;\n            },\n\n            // refactor out to queries.js\n            tile: function(rowOrLocation, col) {\n                var location = normaliseRowCol(rowOrLocation, col);\n                return map.tiles[location.row][location.col];\n            },\n            tilesContaining: function(criteria) {\n                var rows = map.data.tiles,\n                    tiles = [];\n\n                for (var row = 0, rowCount = rows.length; row < rowCount; row++) {\n                    for (var col = 0, colCount = rows[row].length; col < colCount; col++) {\n                        var tile = map.tile(row, col);\n                        if (tile.contains(criteria))\n                            tiles.push(tile);\n                    }\n                }\n\n                return tiles;\n            }\n        };\n\n    map.create = create(map);\n    map.move = move(map);\n    map.data = data;\n    map.tiles = tiles.fromTileData(map.data.tiles, map);\n    map.objects = objects.stack(objectHash);\n\n    return map;\n}\n\nfunction normaliseRowCol(rowOrLocation, col) {\n    if (rowOrLocation === undefined)\n        return undefined;\n\n    var row = rowOrLocation;\n    if (rowOrLocation.row !== undefined && rowOrLocation.col !== undefined) {\n        row = rowOrLocation.row;\n        col = rowOrLocation.col;\n    }\n    return { row: row, col: col };\n}\n\n\n//@ sourceURL=http://app/node_modules/maps/index.js\n", arguments, window, require, module, exports);
(function () {var _ = require('underscore')
    tiles = require('./tiles');

module.exports = {
    load: function(data) {
        return createMap(data);
    },
    create: function(options) {
        return createMap({ 
            tiles: tiles.createData(options.width, options.height)
        });
    }
};

function createMap(data) {
    var create = require('./create'),
        move = require('./move'),
        visibility = require('./visibility'),
        objects = require('objects'),
        objectHash = {},

        map = {
            addObject: function (object, rowOrLocation, col) {
                var location = normaliseRowCol(rowOrLocation, col);
                if (location)
                    map.tile(location).add(object);
                    
                object.map(map);
                objectHash[object.id] = object;

                _.each(object.inventory && object.inventory.items(), function (item) {
                    map.addObject(item);
                });

                return map;
            },
            removeObject: function (object) {
                var location = object.location();
                if (location) {
                    if(location.row && location.col)
                        map.tile(location).remove(object);
                    if (location.container)
                        map.objects(location.container).inventory.remove(object);
                }
                    
                object.map(null);
                object.location(null);
                delete objectHash[object.id];

                _.each(object.inventory && object.inventory.items(), function (item) {
                    map.removeObject(item);
                });

                return map;
            },
            replaceObject: function (object, replacements) {
                var location = object.location();
                map.removeObject(object);
                _.each(replacements, function (replacement) {
                    map.addObject(replacement, location.row, location.col);
                });
            },
            updateVisibility: function () {
                visibility.updateMap(map);
                return map;
            },

            // refactor out to queries.js
            tile: function(rowOrLocation, col) {
                var location = normaliseRowCol(rowOrLocation, col);
                return map.tiles[location.row][location.col];
            },
            tilesContaining: function(criteria) {
                var rows = map.data.tiles,
                    tiles = [];

                for (var row = 0, rowCount = rows.length; row < rowCount; row++) {
                    for (var col = 0, colCount = rows[row].length; col < colCount; col++) {
                        var tile = map.tile(row, col);
                        if (tile.contains(criteria))
                            tiles.push(tile);
                    }
                }

                return tiles;
            }
        };

    map.create = create(map);
    map.move = move(map);
    map.data = data;
    map.tiles = tiles.fromTileData(map.data.tiles, map);
    map.objects = objects.stack(objectHash);

    return map;
}

function normaliseRowCol(rowOrLocation, col) {
    if (rowOrLocation === undefined)
        return undefined;

    var row = rowOrLocation;
    if (rowOrLocation.row !== undefined && rowOrLocation.col !== undefined) {
        row = rowOrLocation.row;
        col = rowOrLocation.col;
    }
    return { row: row, col: col };
}

})
},{"./create":56,"./move":59,"./tiles":61,"./visibility":62,"objects":67,"tribe/client/enhancedDebug":97,"underscore":87}],59:[function(require,module,exports){
require("tribe/client/enhancedDebug").execute("module.exports = function(map) {\n    return function(object, location) {\n        if(object.constructor === String)\n            object = map.objects(object);\n\n        map.tile(object.location()).remove(object);\n        map.tile(location).add(object);\n    }\n};\n//@ sourceURL=http://app/node_modules/maps/move.js\n", arguments, window, require, module, exports);
(function () {module.exports = function(map) {
    return function(object, location) {
        if(object.constructor === String)
            object = map.objects(object);

        map.tile(object.location()).remove(object);
        map.tile(location).add(object);
    }
};})
},{"tribe/client/enhancedDebug":97}],60:[function(require,module,exports){
require("tribe/client/enhancedDebug").execute("var objects = require('objects');\n\nmodule.exports = function (map) {\n    return {\n        start: function (row, col) {\n            createTile(row, col);\n            return {\n                up: function (distance) {\n                    for(var i = 0; i < distance; i++)\n                        createTile(--row, col);   \n                    return this;                 \n                },\n                down: function (distance) {\n                    for(var i = 0; i < distance; i++)\n                        createTile(++row, col);                    \n                    return this;                 \n                },\n                left: function (distance) {\n                    for(var i = 0; i < distance; i++)\n                        createTile(row, --col);                    \n                    return this;                 \n                },\n                right: function (distance) {\n                    for(var i = 0; i < distance; i++)\n                        createTile(row, ++col);                    \n                    return this;                 \n                },\n                horizontal: function (distance) {\n                    distance > 0 ? this.right(distance) : this.left(-1 * distance);\n                    return this;\n                },\n                vertical: function (distance) {\n                    distance > 0 ? this.down(distance) : this.up(-1 * distance);\n                    return this;\n                },\n                end: function () {\n                    return map;\n                }\n            };\n        }\n    };\n\n    function createTile(row, col) {\n        var objectArray = map.tile(row, col).objects;\n        if(objectArray().length > 0) {\n            if(objectArray()[0].type === 'wall') {\n                map.removeObject(objectArray()[0]);\n                map.addObject(objects.create('door'), row, col);\n            }\n        } else\n            map.addObject(objects.create('passage'), row, col);\n    }\n};\n//@ sourceURL=http://app/node_modules/maps/passage.js\n", arguments, window, require, module, exports);
(function () {var objects = require('objects');

module.exports = function (map) {
    return {
        start: function (row, col) {
            createTile(row, col);
            return {
                up: function (distance) {
                    for(var i = 0; i < distance; i++)
                        createTile(--row, col);   
                    return this;                 
                },
                down: function (distance) {
                    for(var i = 0; i < distance; i++)
                        createTile(++row, col);                    
                    return this;                 
                },
                left: function (distance) {
                    for(var i = 0; i < distance; i++)
                        createTile(row, --col);                    
                    return this;                 
                },
                right: function (distance) {
                    for(var i = 0; i < distance; i++)
                        createTile(row, ++col);                    
                    return this;                 
                },
                horizontal: function (distance) {
                    distance > 0 ? this.right(distance) : this.left(-1 * distance);
                    return this;
                },
                vertical: function (distance) {
                    distance > 0 ? this.down(distance) : this.up(-1 * distance);
                    return this;
                },
                end: function () {
                    return map;
                }
            };
        }
    };

    function createTile(row, col) {
        var objectArray = map.tile(row, col).objects;
        if(objectArray().length > 0) {
            if(objectArray()[0].type === 'wall') {
                map.removeObject(objectArray()[0]);
                map.addObject(objects.create('door'), row, col);
            }
        } else
            map.addObject(objects.create('passage'), row, col);
    }
};})
},{"objects":67,"tribe/client/enhancedDebug":97}],61:[function(require,module,exports){
require("tribe/client/enhancedDebug").execute("var objects = require('objects'),\n    locationPath = require('utilities/location.path'),\n    _ = require('underscore');\n\nvar api = module.exports = {\n    fromTileData: function (rows, map) {\n        return _.map(rows, function (cols) {\n            return _.map(cols, function (tileData) {\n                return api.create(tileData, map);\n            });\n        });\n    },\n    createData: function (width, height) {\n        var tileArray = [];\n        for(var row = 0; row < height; row++) {\n            tileArray.push([]);\n            for(var col = 0; col < width; col++) \n                tileArray[row].push({\n                    objects: ko.observableArray(),\n                    location: { row: row, col: col },\n                    visibleTiles: []\n                });\n        }\n        return tileArray;\n    },\n    create: function (data, map) {\n        var objectArray = ko.observableArray();\n\n        _.each(data.objects(), function (objectData) {\n            var object = objects.create(objectData);\n            objectArray.push(object);\n            map.addObject(object);\n        });\n\n        return {\n            data: data,\n            contains: objects.stack(objectArray()).contains,\n            select: objects.stack(objectArray()).select,\n            objects: objectArray,\n            location: data.location,\n            add: function (object) {\n                objectArray.push(object);\n                object.location({ row: data.location.row, col: data.location.col });\n                data.objects.push(object.data);\n            },\n            remove: function (object) {\n                objectArray.remove(object);\n                data.objects.remove(object.data);\n            },\n            pathTo: function (location, map) {\n                var path = locationPath(data.location, location);\n                return {\n                    next: function () {\n                        var nextLocation = path.next();\n                        return nextLocation && map.tile(nextLocation);\n                    }\n                };\n            },\n            visibleTiles: [],\n            canSee: function (location) {\n                return _.findWhere(data.visibleTiles, location) !== undefined;\n            }\n        }\n    }\n};\n//@ sourceURL=http://app/node_modules/maps/tiles.js\n", arguments, window, require, module, exports);
(function () {var objects = require('objects'),
    locationPath = require('utilities/location.path'),
    _ = require('underscore');

var api = module.exports = {
    fromTileData: function (rows, map) {
        return _.map(rows, function (cols) {
            return _.map(cols, function (tileData) {
                return api.create(tileData, map);
            });
        });
    },
    createData: function (width, height) {
        var tileArray = [];
        for(var row = 0; row < height; row++) {
            tileArray.push([]);
            for(var col = 0; col < width; col++) 
                tileArray[row].push({
                    objects: ko.observableArray(),
                    location: { row: row, col: col },
                    visibleTiles: []
                });
        }
        return tileArray;
    },
    create: function (data, map) {
        var objectArray = ko.observableArray();

        _.each(data.objects(), function (objectData) {
            var object = objects.create(objectData);
            objectArray.push(object);
            map.addObject(object);
        });

        return {
            data: data,
            contains: objects.stack(objectArray()).contains,
            select: objects.stack(objectArray()).select,
            objects: objectArray,
            location: data.location,
            add: function (object) {
                objectArray.push(object);
                object.location({ row: data.location.row, col: data.location.col });
                data.objects.push(object.data);
            },
            remove: function (object) {
                objectArray.remove(object);
                data.objects.remove(object.data);
            },
            pathTo: function (location, map) {
                var path = locationPath(data.location, location);
                return {
                    next: function () {
                        var nextLocation = path.next();
                        return nextLocation && map.tile(nextLocation);
                    }
                };
            },
            visibleTiles: [],
            canSee: function (location) {
                return _.findWhere(data.visibleTiles, location) !== undefined;
            }
        }
    }
};})
},{"objects":67,"tribe/client/enhancedDebug":97,"underscore":87,"utilities/location.path":91}],62:[function(require,module,exports){
require("tribe/client/enhancedDebug").execute("var _ = require('underscore');\n\nvar visibility = module.exports = {\n    updateMap: function (map) {\n        var tiles = map.tilesContaining({ occupiable: true });\n\n        _.each(tiles, function (tile) {\n            visibility.updateTile(tile, tiles, map);\n        });\n    },\n    updateTile: function (tile, targetTiles, map) {\n        tile.data.visibleTiles = [];\n\n        _.each(targetTiles, function (targetTile) {\n            var path = tile.pathTo(targetTile.location, map),\n                visible = true,\n                nextTile;\n\n            while (visible && (nextTile = path.next()))\n                visible = nextTile.objects().length > 0 && !nextTile.contains({ obstructs: true });\n\n            if (visible)\n                tile.data.visibleTiles.push(targetTile.location);\n        });\n    }\n};\n\n\n//@ sourceURL=http://app/node_modules/maps/visibility.js\n", arguments, window, require, module, exports);
(function () {var _ = require('underscore');

var visibility = module.exports = {
    updateMap: function (map) {
        var tiles = map.tilesContaining({ occupiable: true });

        _.each(tiles, function (tile) {
            visibility.updateTile(tile, tiles, map);
        });
    },
    updateTile: function (tile, targetTiles, map) {
        tile.data.visibleTiles = [];

        _.each(targetTiles, function (targetTile) {
            var path = tile.pathTo(targetTile.location, map),
                visible = true,
                nextTile;

            while (visible && (nextTile = path.next()))
                visible = nextTile.objects().length > 0 && !nextTile.contains({ obstructs: true });

            if (visible)
                tile.data.visibleTiles.push(targetTile.location);
        });
    }
};

})
},{"tribe/client/enhancedDebug":97,"underscore":87}],63:[function(require,module,exports){
(function (Buffer){
require("tribe/client/enhancedDebug").execute("//     uuid.js\n//\n//     Copyright (c) 2010-2012 Robert Kieffer\n//     MIT License - http://opensource.org/licenses/mit-license.php\n\n(function() {\n  var _global = this;\n\n  // Unique ID creation requires a high quality random # generator.  We feature\n  // detect to determine the best RNG source, normalizing to a function that\n  // returns 128-bits of randomness, since that's what's usually required\n  var _rng;\n\n  // Node.js crypto-based RNG - http://nodejs.org/docs/v0.6.2/api/crypto.html\n  //\n  // Moderately fast, high quality\n  if (typeof(require) == 'function') {\n    try {\n      var _rb = require('crypto').randomBytes;\n      _rng = _rb && function() {return _rb(16);};\n    } catch(e) {}\n  }\n\n  if (!_rng && _global.crypto && crypto.getRandomValues) {\n    // WHATWG crypto-based RNG - http://wiki.whatwg.org/wiki/Crypto\n    //\n    // Moderately fast, high quality\n    var _rnds8 = new Uint8Array(16);\n    _rng = function whatwgRNG() {\n      crypto.getRandomValues(_rnds8);\n      return _rnds8;\n    };\n  }\n\n  if (!_rng) {\n    // Math.random()-based (RNG)\n    //\n    // If all else fails, use Math.random().  It's fast, but is of unspecified\n    // quality.\n    var  _rnds = new Array(16);\n    _rng = function() {\n      for (var i = 0, r; i < 16; i++) {\n        if ((i & 0x03) === 0) r = Math.random() * 0x100000000;\n        _rnds[i] = r >>> ((i & 0x03) << 3) & 0xff;\n      }\n\n      return _rnds;\n    };\n  }\n\n  // Buffer class to use\n  var BufferClass = typeof(Buffer) == 'function' ? Buffer : Array;\n\n  // Maps for number <-> hex string conversion\n  var _byteToHex = [];\n  var _hexToByte = {};\n  for (var i = 0; i < 256; i++) {\n    _byteToHex[i] = (i + 0x100).toString(16).substr(1);\n    _hexToByte[_byteToHex[i]] = i;\n  }\n\n  // **`parse()` - Parse a UUID into it's component bytes**\n  function parse(s, buf, offset) {\n    var i = (buf && offset) || 0, ii = 0;\n\n    buf = buf || [];\n    s.toLowerCase().replace(/[0-9a-f]{2}/g, function(oct) {\n      if (ii < 16) { // Don't overflow!\n        buf[i + ii++] = _hexToByte[oct];\n      }\n    });\n\n    // Zero out remaining bytes if string was short\n    while (ii < 16) {\n      buf[i + ii++] = 0;\n    }\n\n    return buf;\n  }\n\n  // **`unparse()` - Convert UUID byte array (ala parse()) into a string**\n  function unparse(buf, offset) {\n    var i = offset || 0, bth = _byteToHex;\n    return  bth[buf[i++]] + bth[buf[i++]] +\n            bth[buf[i++]] + bth[buf[i++]] + '-' +\n            bth[buf[i++]] + bth[buf[i++]] + '-' +\n            bth[buf[i++]] + bth[buf[i++]] + '-' +\n            bth[buf[i++]] + bth[buf[i++]] + '-' +\n            bth[buf[i++]] + bth[buf[i++]] +\n            bth[buf[i++]] + bth[buf[i++]] +\n            bth[buf[i++]] + bth[buf[i++]];\n  }\n\n  // **`v1()` - Generate time-based UUID**\n  //\n  // Inspired by https://github.com/LiosK/UUID.js\n  // and http://docs.python.org/library/uuid.html\n\n  // random #'s we need to init node and clockseq\n  var _seedBytes = _rng();\n\n  // Per 4.5, create and 48-bit node id, (47 random bits + multicast bit = 1)\n  var _nodeId = [\n    _seedBytes[0] | 0x01,\n    _seedBytes[1], _seedBytes[2], _seedBytes[3], _seedBytes[4], _seedBytes[5]\n  ];\n\n  // Per 4.2.2, randomize (14 bit) clockseq\n  var _clockseq = (_seedBytes[6] << 8 | _seedBytes[7]) & 0x3fff;\n\n  // Previous uuid creation time\n  var _lastMSecs = 0, _lastNSecs = 0;\n\n  // See https://github.com/broofa/node-uuid for API details\n  function v1(options, buf, offset) {\n    var i = buf && offset || 0;\n    var b = buf || [];\n\n    options = options || {};\n\n    var clockseq = options.clockseq != null ? options.clockseq : _clockseq;\n\n    // UUID timestamps are 100 nano-second units since the Gregorian epoch,\n    // (1582-10-15 00:00).  JSNumbers aren't precise enough for this, so\n    // time is handled internally as 'msecs' (integer milliseconds) and 'nsecs'\n    // (100-nanoseconds offset from msecs) since unix epoch, 1970-01-01 00:00.\n    var msecs = options.msecs != null ? options.msecs : new Date().getTime();\n\n    // Per 4.2.1.2, use count of uuid's generated during the current clock\n    // cycle to simulate higher resolution clock\n    var nsecs = options.nsecs != null ? options.nsecs : _lastNSecs + 1;\n\n    // Time since last uuid creation (in msecs)\n    var dt = (msecs - _lastMSecs) + (nsecs - _lastNSecs)/10000;\n\n    // Per 4.2.1.2, Bump clockseq on clock regression\n    if (dt < 0 && options.clockseq == null) {\n      clockseq = clockseq + 1 & 0x3fff;\n    }\n\n    // Reset nsecs if clock regresses (new clockseq) or we've moved onto a new\n    // time interval\n    if ((dt < 0 || msecs > _lastMSecs) && options.nsecs == null) {\n      nsecs = 0;\n    }\n\n    // Per 4.2.1.2 Throw error if too many uuids are requested\n    if (nsecs >= 10000) {\n      throw new Error('uuid.v1(): Can\\'t create more than 10M uuids/sec');\n    }\n\n    _lastMSecs = msecs;\n    _lastNSecs = nsecs;\n    _clockseq = clockseq;\n\n    // Per 4.1.4 - Convert from unix epoch to Gregorian epoch\n    msecs += 12219292800000;\n\n    // `time_low`\n    var tl = ((msecs & 0xfffffff) * 10000 + nsecs) % 0x100000000;\n    b[i++] = tl >>> 24 & 0xff;\n    b[i++] = tl >>> 16 & 0xff;\n    b[i++] = tl >>> 8 & 0xff;\n    b[i++] = tl & 0xff;\n\n    // `time_mid`\n    var tmh = (msecs / 0x100000000 * 10000) & 0xfffffff;\n    b[i++] = tmh >>> 8 & 0xff;\n    b[i++] = tmh & 0xff;\n\n    // `time_high_and_version`\n    b[i++] = tmh >>> 24 & 0xf | 0x10; // include version\n    b[i++] = tmh >>> 16 & 0xff;\n\n    // `clock_seq_hi_and_reserved` (Per 4.2.2 - include variant)\n    b[i++] = clockseq >>> 8 | 0x80;\n\n    // `clock_seq_low`\n    b[i++] = clockseq & 0xff;\n\n    // `node`\n    var node = options.node || _nodeId;\n    for (var n = 0; n < 6; n++) {\n      b[i + n] = node[n];\n    }\n\n    return buf ? buf : unparse(b);\n  }\n\n  // **`v4()` - Generate random UUID**\n\n  // See https://github.com/broofa/node-uuid for API details\n  function v4(options, buf, offset) {\n    // Deprecated - 'format' argument, as supported in v1.2\n    var i = buf && offset || 0;\n\n    if (typeof(options) == 'string') {\n      buf = options == 'binary' ? new BufferClass(16) : null;\n      options = null;\n    }\n    options = options || {};\n\n    var rnds = options.random || (options.rng || _rng)();\n\n    // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`\n    rnds[6] = (rnds[6] & 0x0f) | 0x40;\n    rnds[8] = (rnds[8] & 0x3f) | 0x80;\n\n    // Copy bytes to buffer, if provided\n    if (buf) {\n      for (var ii = 0; ii < 16; ii++) {\n        buf[i + ii] = rnds[ii];\n      }\n    }\n\n    return buf || unparse(rnds);\n  }\n\n  // Export public API\n  var uuid = v4;\n  uuid.v1 = v1;\n  uuid.v4 = v4;\n  uuid.parse = parse;\n  uuid.unparse = unparse;\n  uuid.BufferClass = BufferClass;\n\n  if (typeof define === 'function' && define.amd) {\n    // Publish as AMD module\n    define(function() {return uuid;});\n  } else if (typeof(module) != 'undefined' && module.exports) {\n    // Publish as node.js module\n    module.exports = uuid;\n  } else {\n    // Publish as global (in browsers)\n    var _previousRoot = _global.uuid;\n\n    // **`noConflict()` - (browser only) to reset global 'uuid' var**\n    uuid.noConflict = function() {\n      _global.uuid = _previousRoot;\n      return uuid;\n    };\n\n    _global.uuid = uuid;\n  }\n}).call(this);\n\n//@ sourceURL=http://app/node_modules/node-uuid/uuid.js\n", arguments, window, require, module, exports);
(function () {//     uuid.js
//
//     Copyright (c) 2010-2012 Robert Kieffer
//     MIT License - http://opensource.org/licenses/mit-license.php

(function() {
  var _global = this;

  // Unique ID creation requires a high quality random # generator.  We feature
  // detect to determine the best RNG source, normalizing to a function that
  // returns 128-bits of randomness, since that's what's usually required
  var _rng;

  // Node.js crypto-based RNG - http://nodejs.org/docs/v0.6.2/api/crypto.html
  //
  // Moderately fast, high quality
  if (typeof(require) == 'function') {
    try {
      var _rb = require('crypto').randomBytes;
      _rng = _rb && function() {return _rb(16);};
    } catch(e) {}
  }

  if (!_rng && _global.crypto && crypto.getRandomValues) {
    // WHATWG crypto-based RNG - http://wiki.whatwg.org/wiki/Crypto
    //
    // Moderately fast, high quality
    var _rnds8 = new Uint8Array(16);
    _rng = function whatwgRNG() {
      crypto.getRandomValues(_rnds8);
      return _rnds8;
    };
  }

  if (!_rng) {
    // Math.random()-based (RNG)
    //
    // If all else fails, use Math.random().  It's fast, but is of unspecified
    // quality.
    var  _rnds = new Array(16);
    _rng = function() {
      for (var i = 0, r; i < 16; i++) {
        if ((i & 0x03) === 0) r = Math.random() * 0x100000000;
        _rnds[i] = r >>> ((i & 0x03) << 3) & 0xff;
      }

      return _rnds;
    };
  }

  // Buffer class to use
  var BufferClass = typeof(Buffer) == 'function' ? Buffer : Array;

  // Maps for number <-> hex string conversion
  var _byteToHex = [];
  var _hexToByte = {};
  for (var i = 0; i < 256; i++) {
    _byteToHex[i] = (i + 0x100).toString(16).substr(1);
    _hexToByte[_byteToHex[i]] = i;
  }

  // **`parse()` - Parse a UUID into it's component bytes**
  function parse(s, buf, offset) {
    var i = (buf && offset) || 0, ii = 0;

    buf = buf || [];
    s.toLowerCase().replace(/[0-9a-f]{2}/g, function(oct) {
      if (ii < 16) { // Don't overflow!
        buf[i + ii++] = _hexToByte[oct];
      }
    });

    // Zero out remaining bytes if string was short
    while (ii < 16) {
      buf[i + ii++] = 0;
    }

    return buf;
  }

  // **`unparse()` - Convert UUID byte array (ala parse()) into a string**
  function unparse(buf, offset) {
    var i = offset || 0, bth = _byteToHex;
    return  bth[buf[i++]] + bth[buf[i++]] +
            bth[buf[i++]] + bth[buf[i++]] + '-' +
            bth[buf[i++]] + bth[buf[i++]] + '-' +
            bth[buf[i++]] + bth[buf[i++]] + '-' +
            bth[buf[i++]] + bth[buf[i++]] + '-' +
            bth[buf[i++]] + bth[buf[i++]] +
            bth[buf[i++]] + bth[buf[i++]] +
            bth[buf[i++]] + bth[buf[i++]];
  }

  // **`v1()` - Generate time-based UUID**
  //
  // Inspired by https://github.com/LiosK/UUID.js
  // and http://docs.python.org/library/uuid.html

  // random #'s we need to init node and clockseq
  var _seedBytes = _rng();

  // Per 4.5, create and 48-bit node id, (47 random bits + multicast bit = 1)
  var _nodeId = [
    _seedBytes[0] | 0x01,
    _seedBytes[1], _seedBytes[2], _seedBytes[3], _seedBytes[4], _seedBytes[5]
  ];

  // Per 4.2.2, randomize (14 bit) clockseq
  var _clockseq = (_seedBytes[6] << 8 | _seedBytes[7]) & 0x3fff;

  // Previous uuid creation time
  var _lastMSecs = 0, _lastNSecs = 0;

  // See https://github.com/broofa/node-uuid for API details
  function v1(options, buf, offset) {
    var i = buf && offset || 0;
    var b = buf || [];

    options = options || {};

    var clockseq = options.clockseq != null ? options.clockseq : _clockseq;

    // UUID timestamps are 100 nano-second units since the Gregorian epoch,
    // (1582-10-15 00:00).  JSNumbers aren't precise enough for this, so
    // time is handled internally as 'msecs' (integer milliseconds) and 'nsecs'
    // (100-nanoseconds offset from msecs) since unix epoch, 1970-01-01 00:00.
    var msecs = options.msecs != null ? options.msecs : new Date().getTime();

    // Per 4.2.1.2, use count of uuid's generated during the current clock
    // cycle to simulate higher resolution clock
    var nsecs = options.nsecs != null ? options.nsecs : _lastNSecs + 1;

    // Time since last uuid creation (in msecs)
    var dt = (msecs - _lastMSecs) + (nsecs - _lastNSecs)/10000;

    // Per 4.2.1.2, Bump clockseq on clock regression
    if (dt < 0 && options.clockseq == null) {
      clockseq = clockseq + 1 & 0x3fff;
    }

    // Reset nsecs if clock regresses (new clockseq) or we've moved onto a new
    // time interval
    if ((dt < 0 || msecs > _lastMSecs) && options.nsecs == null) {
      nsecs = 0;
    }

    // Per 4.2.1.2 Throw error if too many uuids are requested
    if (nsecs >= 10000) {
      throw new Error('uuid.v1(): Can\'t create more than 10M uuids/sec');
    }

    _lastMSecs = msecs;
    _lastNSecs = nsecs;
    _clockseq = clockseq;

    // Per 4.1.4 - Convert from unix epoch to Gregorian epoch
    msecs += 12219292800000;

    // `time_low`
    var tl = ((msecs & 0xfffffff) * 10000 + nsecs) % 0x100000000;
    b[i++] = tl >>> 24 & 0xff;
    b[i++] = tl >>> 16 & 0xff;
    b[i++] = tl >>> 8 & 0xff;
    b[i++] = tl & 0xff;

    // `time_mid`
    var tmh = (msecs / 0x100000000 * 10000) & 0xfffffff;
    b[i++] = tmh >>> 8 & 0xff;
    b[i++] = tmh & 0xff;

    // `time_high_and_version`
    b[i++] = tmh >>> 24 & 0xf | 0x10; // include version
    b[i++] = tmh >>> 16 & 0xff;

    // `clock_seq_hi_and_reserved` (Per 4.2.2 - include variant)
    b[i++] = clockseq >>> 8 | 0x80;

    // `clock_seq_low`
    b[i++] = clockseq & 0xff;

    // `node`
    var node = options.node || _nodeId;
    for (var n = 0; n < 6; n++) {
      b[i + n] = node[n];
    }

    return buf ? buf : unparse(b);
  }

  // **`v4()` - Generate random UUID**

  // See https://github.com/broofa/node-uuid for API details
  function v4(options, buf, offset) {
    // Deprecated - 'format' argument, as supported in v1.2
    var i = buf && offset || 0;

    if (typeof(options) == 'string') {
      buf = options == 'binary' ? new BufferClass(16) : null;
      options = null;
    }
    options = options || {};

    var rnds = options.random || (options.rng || _rng)();

    // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`
    rnds[6] = (rnds[6] & 0x0f) | 0x40;
    rnds[8] = (rnds[8] & 0x3f) | 0x80;

    // Copy bytes to buffer, if provided
    if (buf) {
      for (var ii = 0; ii < 16; ii++) {
        buf[i + ii] = rnds[ii];
      }
    }

    return buf || unparse(rnds);
  }

  // Export public API
  var uuid = v4;
  uuid.v1 = v1;
  uuid.v4 = v4;
  uuid.parse = parse;
  uuid.unparse = unparse;
  uuid.BufferClass = BufferClass;

  if (typeof define === 'function' && define.amd) {
    // Publish as AMD module
    define(function() {return uuid;});
  } else if (typeof(module) != 'undefined' && module.exports) {
    // Publish as node.js module
    module.exports = uuid;
  } else {
    // Publish as global (in browsers)
    var _previousRoot = _global.uuid;

    // **`noConflict()` - (browser only) to reset global 'uuid' var**
    uuid.noConflict = function() {
      _global.uuid = _previousRoot;
      return uuid;
    };

    _global.uuid = uuid;
  }
}).call(this);
})
}).call(this,require("buffer").Buffer)
},{"buffer":26,"crypto":28,"tribe/client/enhancedDebug":97}],64:[function(require,module,exports){
require("tribe/client/enhancedDebug").execute("module.exports = {\n    'wh': {\n        name: 'Weapons (Hand to Hand)',\n        actions: [\n            {\n                image: 'handtohand.png',\n                equippedImage: 'handtohand-equipped.png',\n                action: 'equip'\n            }\n        ]\n    },\n    'wr': {\n        name: 'Weapons (Ranged)',\n        actions: [\n            {\n                image: 'ranged.png',\n                equippedImage: 'ranged-equipped.png',\n                action: 'equip'\n            }\n        ]\n    },\n    'a': {\n        name: 'Armour',\n        actions: [\n            {\n                image: 'armour.png',\n                equippedImage: 'armour-equipped.png',\n                action: 'equip'\n            }\n        ]\n    },\n    'p': {\n        name: 'Potions',\n        actions: [\n            {\n                image: 'quaff.png',\n                action: 'quaff'\n            }\n        ]\n    },\n    'm': {\n        name: 'Miscellaneous',\n        actions: { }\n    }\n};\n//@ sourceURL=http://app/node_modules/objects/categories.js\n", arguments, window, require, module, exports);
(function () {module.exports = {
    'wh': {
        name: 'Weapons (Hand to Hand)',
        actions: [
            {
                image: 'handtohand.png',
                equippedImage: 'handtohand-equipped.png',
                action: 'equip'
            }
        ]
    },
    'wr': {
        name: 'Weapons (Ranged)',
        actions: [
            {
                image: 'ranged.png',
                equippedImage: 'ranged-equipped.png',
                action: 'equip'
            }
        ]
    },
    'a': {
        name: 'Armour',
        actions: [
            {
                image: 'armour.png',
                equippedImage: 'armour-equipped.png',
                action: 'equip'
            }
        ]
    },
    'p': {
        name: 'Potions',
        actions: [
            {
                image: 'quaff.png',
                action: 'quaff'
            }
        ]
    },
    'm': {
        name: 'Miscellaneous',
        actions: { }
    }
};})
},{"tribe/client/enhancedDebug":97}],65:[function(require,module,exports){
require("tribe/client/enhancedDebug").execute("var behaviours = require('behaviours'),\n    queue = require('actions/queue'),\n    inventory = require('./inventory'),\n    pubsub = require('tribe').pubsub,\n    utils = require('utilities/objects'),\n    random = require('utilities/random'),\n    _ = require('underscore'),\n    uuid = require('node-uuid');\n\nvar create = module.exports = function (definitions, type, properties) {\n    // if only one argument is passed, it is the persisted data\n    var persisted = (arguments.length === 1) && definitions;\n\n    var data = persisted || { \n            id: uuid.v4(),\n            type: type,\n            behaviours: [],\n            location: ko.observable(),\n            inventory: {},\n            attributes: {}\n        },\n        object = {\n            id: data.id,\n            type: data.type,        \n            location: data.location,\n            data: data,\n            map: ko.observable()\n        };\n\n    object.queue = queue(pubsub, object)\n    object.behaviours = behaviours.forObject(object);\n    object.act = object.queue.pushNext;\n    object.inventory = inventory(data.inventory, object.id);\n\n    if(!persisted)\n        inheritFrom(type, object);\n\n    object.attributes = data.attributes;\n    object.attributes.maxHealth = object.attributes.maxHealth || object.attributes.health;\n    utils.makeObservable(object.attributes);\n\n    object.category = object.data.category;\n\n    _.extend(object.data, properties);\n\n    // if we're restoring objects on a map, attaching behaviours before\n    // the deserialization is complete causes problems\n    if(!persisted)\n        object.behaviours.attachExisting();\n\n    object.die = function () {\n        object.nextAction = false;\n        object.behaviours.end();\n    };\n\n    return object;\n\n    function inheritFrom(type) {\n        var definition = definitions[type] || {};\n\n        // all objects inherit from the base object type\n        if(type !== 'object' && definition.inherits === undefined)\n            inheritFrom('object');\n\n        // make inheritance recursive, and apply base types first\n        _.each(definition.inherits, function (baseType) {\n            inheritFrom(baseType);\n        });\n\n        utils.merge(object.data, definition.template);\n        createInventoryItems(definition.inventory);\n    }\n\n    function createInventoryItems(items) {\n        _.each(items, function (item) {\n            if (!item.probability || random.probability(item.probability)) {\n                var newObject = create(definitions, item.type, getItemProperties(item));\n                object.inventory.add(newObject);\n\n                if (item.equipped)\n                    object.inventory.equip(newObject);\n            }\n        });\n    }\n\n    function getItemProperties(item) {\n        var properties = {};\n\n        if (item.quantity)\n            properties.quantity = random.range(item.quantity.min, item.quantity.max);\n\n        return properties;\n    }\n};\n\n//@ sourceURL=http://app/node_modules/objects/create.js\n", arguments, window, require, module, exports);
(function () {var behaviours = require('behaviours'),
    queue = require('actions/queue'),
    inventory = require('./inventory'),
    pubsub = require('tribe').pubsub,
    utils = require('utilities/objects'),
    random = require('utilities/random'),
    _ = require('underscore'),
    uuid = require('node-uuid');

var create = module.exports = function (definitions, type, properties) {
    // if only one argument is passed, it is the persisted data
    var persisted = (arguments.length === 1) && definitions;

    var data = persisted || { 
            id: uuid.v4(),
            type: type,
            behaviours: [],
            location: ko.observable(),
            inventory: {},
            attributes: {}
        },
        object = {
            id: data.id,
            type: data.type,        
            location: data.location,
            data: data,
            map: ko.observable()
        };

    object.queue = queue(pubsub, object)
    object.behaviours = behaviours.forObject(object);
    object.act = object.queue.pushNext;
    object.inventory = inventory(data.inventory, object.id);

    if(!persisted)
        inheritFrom(type, object);

    object.attributes = data.attributes;
    object.attributes.maxHealth = object.attributes.maxHealth || object.attributes.health;
    utils.makeObservable(object.attributes);

    object.category = object.data.category;

    _.extend(object.data, properties);

    // if we're restoring objects on a map, attaching behaviours before
    // the deserialization is complete causes problems
    if(!persisted)
        object.behaviours.attachExisting();

    object.die = function () {
        object.nextAction = false;
        object.behaviours.end();
    };

    return object;

    function inheritFrom(type) {
        var definition = definitions[type] || {};

        // all objects inherit from the base object type
        if(type !== 'object' && definition.inherits === undefined)
            inheritFrom('object');

        // make inheritance recursive, and apply base types first
        _.each(definition.inherits, function (baseType) {
            inheritFrom(baseType);
        });

        utils.merge(object.data, definition.template);
        createInventoryItems(definition.inventory);
    }

    function createInventoryItems(items) {
        _.each(items, function (item) {
            if (!item.probability || random.probability(item.probability)) {
                var newObject = create(definitions, item.type, getItemProperties(item));
                object.inventory.add(newObject);

                if (item.equipped)
                    object.inventory.equip(newObject);
            }
        });
    }

    function getItemProperties(item) {
        var properties = {};

        if (item.quantity)
            properties.quantity = random.range(item.quantity.min, item.quantity.max);

        return properties;
    }
};
})
},{"./inventory":68,"actions/queue":35,"behaviours":42,"node-uuid":63,"tribe":"truKqQ","tribe/client/enhancedDebug":97,"underscore":87,"utilities/objects":93,"utilities/random":95}],66:[function(require,module,exports){
require("tribe/client/enhancedDebug").execute("var _ = require('underscore');\n\nmodule.exports = function (observableArray) {\n    var objectCategories = require('./categories'),\n        categories = ko.observableArray(),\n        subscriptions = [observableArray.subscribe(update, null, 'arrayChange')];\n\n    _.each(objectCategories, function (category, code) {\n        createCategory(code);\n    });\n    _.each(observableArray(), addObject);\n\n    categories.find = findCategory;\n    categories.subscribe = subscribe;\n    categories.dispose = dispose;\n\n    return categories;\n\n    function addObject(object) {\n        if (object.data.category)\n            return findCategory(object.data.category).items.push(object);\n    }\n\n    function removeObject(object) {\n        if (object.data.category) {\n            var group = findCategory(object.data.category);\n            group.items.remove(object);\n            if (group.items().length === 0)\n                removeCategory(group);\n        }\n    }\n\n    function createCategory(code) {\n        var category = { code: code, items: ko.observableArray(), category: objectCategories[code] };\n        categories.push(category);\n        return category;\n    }\n\n    function removeCategory(category) {\n        categories.remove(category);\n    }\n\n    function findCategory(code) {\n        return _.findWhere(categories(), { code: code }) || createCategory(code);\n    }\n\n    function update(changes) {\n        _.each(changes, function (change) {\n            if (change.status === 'added')\n                addObject(change.value);\n            else\n                removeObject(change.value);\n        });\n    }\n\n    function subscribe(callback) {\n        var subscription = observableArray.subscribe.apply(observableArray, arguments);\n        subscriptions.push(subscription);\n        return subscription;\n    }\n\n    function dispose() {\n        _.invoke(subscriptions, 'dispose');\n    }\n};\n//@ sourceURL=http://app/node_modules/objects/group.js\n", arguments, window, require, module, exports);
(function () {var _ = require('underscore');

module.exports = function (observableArray) {
    var objectCategories = require('./categories'),
        categories = ko.observableArray(),
        subscriptions = [observableArray.subscribe(update, null, 'arrayChange')];

    _.each(objectCategories, function (category, code) {
        createCategory(code);
    });
    _.each(observableArray(), addObject);

    categories.find = findCategory;
    categories.subscribe = subscribe;
    categories.dispose = dispose;

    return categories;

    function addObject(object) {
        if (object.data.category)
            return findCategory(object.data.category).items.push(object);
    }

    function removeObject(object) {
        if (object.data.category) {
            var group = findCategory(object.data.category);
            group.items.remove(object);
            if (group.items().length === 0)
                removeCategory(group);
        }
    }

    function createCategory(code) {
        var category = { code: code, items: ko.observableArray(), category: objectCategories[code] };
        categories.push(category);
        return category;
    }

    function removeCategory(category) {
        categories.remove(category);
    }

    function findCategory(code) {
        return _.findWhere(categories(), { code: code }) || createCategory(code);
    }

    function update(changes) {
        _.each(changes, function (change) {
            if (change.status === 'added')
                addObject(change.value);
            else
                removeObject(change.value);
        });
    }

    function subscribe(callback) {
        var subscription = observableArray.subscribe.apply(observableArray, arguments);
        subscriptions.push(subscription);
        return subscription;
    }

    function dispose() {
        _.invoke(subscriptions, 'dispose');
    }
};})
},{"./categories":64,"tribe/client/enhancedDebug":97,"underscore":87}],67:[function(require,module,exports){
require("tribe/client/enhancedDebug").execute("var create = require('./create'),\n    stack = require('./stack'),\n    set = require('./set'),\n    queries = require('./queries'),\n    _ = require('underscore'),\n    definitions = {},\n    api;\n\napi = module.exports = {};\n\napi.create = function (typeOrData, properties) {\n    return typeOrData.constructor === String ?\n        create(definitions, typeOrData, properties) :\n        create(typeOrData);\n};\n\napi.register = function (types) {\n    _.each(types, function (definition, type) {\n        definitions[type] = definition;\n    });\n};\n\napi.inherits = function (object, type) {\n    return queries.inherits(object.type, type);\n};\n\napi.stack = stack;\napi.set = set;\napi.definitions = definitions;\n\n\n// load explicitly to keep browserify in line\napi.register(require('./types/object'));\napi.register(require('./types/armour'));\napi.register(require('./types/creatues'));\napi.register(require('./types/map'));\napi.register(require('./types/miscellaneous'));\napi.register(require('./types/weapons'));\napi.register(require('./types/potions'));\n\n//@ sourceURL=http://app/node_modules/objects/index.js\n", arguments, window, require, module, exports);
(function () {var create = require('./create'),
    stack = require('./stack'),
    set = require('./set'),
    queries = require('./queries'),
    _ = require('underscore'),
    definitions = {},
    api;

api = module.exports = {};

api.create = function (typeOrData, properties) {
    return typeOrData.constructor === String ?
        create(definitions, typeOrData, properties) :
        create(typeOrData);
};

api.register = function (types) {
    _.each(types, function (definition, type) {
        definitions[type] = definition;
    });
};

api.inherits = function (object, type) {
    return queries.inherits(object.type, type);
};

api.stack = stack;
api.set = set;
api.definitions = definitions;


// load explicitly to keep browserify in line
api.register(require('./types/object'));
api.register(require('./types/armour'));
api.register(require('./types/creatues'));
api.register(require('./types/map'));
api.register(require('./types/miscellaneous'));
api.register(require('./types/weapons'));
api.register(require('./types/potions'));
})
},{"./create":65,"./queries":69,"./set":70,"./stack":71,"./types/armour":72,"./types/creatues":73,"./types/map":74,"./types/miscellaneous":75,"./types/object":76,"./types/potions":77,"./types/weapons":78,"tribe/client/enhancedDebug":97,"underscore":87}],68:[function(require,module,exports){
require("tribe/client/enhancedDebug").execute("module.exports = function (data, containerId) {\n    var create = require('./create'),\n        _ = require('underscore');\n\n    data = data || {};\n    data.equipped = data.equipped || {};\n    data.items = data.items || ko.observableArray();\n    data.gold = data.gold || ko.observable(0);\n\n    // TODO: load this up with already equipped items from data\n    var items = ko.observableArray(_.map(data.items(), function (item) {\n            return create(item);\n        })),\n        equipped = {};\n\n    return {\n        add: function (object) {\n            if (object.type === 'gold')\n                data.gold(data.gold() + object.data.quantity || 1);\n            else {\n                object.location({ container: containerId });\n                items.push(object);\n                data.items.push(object.data);\n            }\n        },\n        remove: function (object) {\n            items.remove(object);\n            data.items.remove(object.data);\n        },\n        equip: function (object) {\n            // probably should check if we actually have this item in our inventory...\n            // though this validation may best be done from the (upcoming) action validation layer\n            data.equipped[object.category] = object.id;\n\n            if (!equipped[object.category])\n                equipped[object.category] = ko.observable();\n\n            equipped[object.category](object);\n        },\n        unequip: function (category) {\n            delete data.equipped[category];\n            equipped[category](null);\n        },\n        equipped: function (category) {\n            if (!equipped[category])\n                equipped[category] = ko.observable();\n\n            return equipped[category];\n        },\n        item: function (id) {\n            return _.findWhere(items(), { id: id });\n        },\n        items: items,\n        gold: data.gold\n    };\n};\n//@ sourceURL=http://app/node_modules/objects/inventory.js\n", arguments, window, require, module, exports);
(function () {module.exports = function (data, containerId) {
    var create = require('./create'),
        _ = require('underscore');

    data = data || {};
    data.equipped = data.equipped || {};
    data.items = data.items || ko.observableArray();
    data.gold = data.gold || ko.observable(0);

    // TODO: load this up with already equipped items from data
    var items = ko.observableArray(_.map(data.items(), function (item) {
            return create(item);
        })),
        equipped = {};

    return {
        add: function (object) {
            if (object.type === 'gold')
                data.gold(data.gold() + object.data.quantity || 1);
            else {
                object.location({ container: containerId });
                items.push(object);
                data.items.push(object.data);
            }
        },
        remove: function (object) {
            items.remove(object);
            data.items.remove(object.data);
        },
        equip: function (object) {
            // probably should check if we actually have this item in our inventory...
            // though this validation may best be done from the (upcoming) action validation layer
            data.equipped[object.category] = object.id;

            if (!equipped[object.category])
                equipped[object.category] = ko.observable();

            equipped[object.category](object);
        },
        unequip: function (category) {
            delete data.equipped[category];
            equipped[category](null);
        },
        equipped: function (category) {
            if (!equipped[category])
                equipped[category] = ko.observable();

            return equipped[category];
        },
        item: function (id) {
            return _.findWhere(items(), { id: id });
        },
        items: items,
        gold: data.gold
    };
};})
},{"./create":65,"tribe/client/enhancedDebug":97,"underscore":87}],69:[function(require,module,exports){
require("tribe/client/enhancedDebug").execute("var _ = require('underscore'),\n    group = require('./group');\n\nqueries = module.exports = {\n    inherits: function (objectType, baseType) {\n        var definition = require('./index').definitions[objectType];\n        return definition && _.any(definition.inherits, function (inheritedType) {\n            return inheritedType === baseType || queries.inherits(inheritedType, baseType);\n        });\n    },\n    predicateFor: function (criteria) {\n        if (typeof criteria === 'string')\n            criteria = { type: criteria };\n\n        return function (object) {\n            return _.all(criteria, function (value, key) {\n                if (key === 'type')\n                    return object.type === value || queries.inherits(object.type, value);\n                else\n                    return object.data[key] === value;\n            });\n        };\n    },\n    groupByCategory: group\n};\n//@ sourceURL=http://app/node_modules/objects/queries.js\n", arguments, window, require, module, exports);
(function () {var _ = require('underscore'),
    group = require('./group');

queries = module.exports = {
    inherits: function (objectType, baseType) {
        var definition = require('./index').definitions[objectType];
        return definition && _.any(definition.inherits, function (inheritedType) {
            return inheritedType === baseType || queries.inherits(inheritedType, baseType);
        });
    },
    predicateFor: function (criteria) {
        if (typeof criteria === 'string')
            criteria = { type: criteria };

        return function (object) {
            return _.all(criteria, function (value, key) {
                if (key === 'type')
                    return object.type === value || queries.inherits(object.type, value);
                else
                    return object.data[key] === value;
            });
        };
    },
    groupByCategory: group
};})
},{"./group":66,"./index":67,"tribe/client/enhancedDebug":97,"underscore":87}],70:[function(require,module,exports){
require("tribe/client/enhancedDebug").execute("var queries = require('./queries'),\n    _ = require('underscore');\n\nmodule.exports = function (source, criteria) {\n    var predicate = queries.predicateFor(criteria),\n        result = ko.observableArray(_.filter(source(), predicate));\n\n    source.subscribe(function (changes) {\n        _.each(changes, function (change) {\n            if (predicate(change.value))\n                switch (change.status) {\n                    case 'added': result.push(change.value); break;\n                    case 'deleted': result.remove(change.value); break;\n                }\n        });\n    }, null, \"arrayChange\");\n\n    return result;\n};\n//@ sourceURL=http://app/node_modules/objects/set.js\n", arguments, window, require, module, exports);
(function () {var queries = require('./queries'),
    _ = require('underscore');

module.exports = function (source, criteria) {
    var predicate = queries.predicateFor(criteria),
        result = ko.observableArray(_.filter(source(), predicate));

    source.subscribe(function (changes) {
        _.each(changes, function (change) {
            if (predicate(change.value))
                switch (change.status) {
                    case 'added': result.push(change.value); break;
                    case 'deleted': result.remove(change.value); break;
                }
        });
    }, null, "arrayChange");

    return result;
};})
},{"./queries":69,"tribe/client/enhancedDebug":97,"underscore":87}],71:[function(require,module,exports){
require("tribe/client/enhancedDebug").execute("var _ = require('underscore'),\n    queries = require('./queries');\n\nmodule.exports = function (objects) {\n    // this may be faster as a constructor with prototype functions, \n    // but we can't get the API of a function with additional properties\n    var result = function (id) {\n            if (objects.constructor === Array)\n                return _.find(objects, queries.predicateFor({ id: id }));\n            return objects[id];\n        };\n\n    result.contains = function (criteria) {\n        return result.find(criteria) !== undefined;\n    };\n\n    result.select = function (criteria) {\n        return _.filter(objects, queries.predicateFor(criteria));\n    };\n\n    result.find = function (criteria) {\n        return _.find(objects, queries.predicateFor(criteria));\n    };\n\n    result.all = function () {\n        return _.values(objects);\n    };\n\n    return result;\n};\n//@ sourceURL=http://app/node_modules/objects/stack.js\n", arguments, window, require, module, exports);
(function () {var _ = require('underscore'),
    queries = require('./queries');

module.exports = function (objects) {
    // this may be faster as a constructor with prototype functions, 
    // but we can't get the API of a function with additional properties
    var result = function (id) {
            if (objects.constructor === Array)
                return _.find(objects, queries.predicateFor({ id: id }));
            return objects[id];
        };

    result.contains = function (criteria) {
        return result.find(criteria) !== undefined;
    };

    result.select = function (criteria) {
        return _.filter(objects, queries.predicateFor(criteria));
    };

    result.find = function (criteria) {
        return _.find(objects, queries.predicateFor(criteria));
    };

    result.all = function () {
        return _.values(objects);
    };

    return result;
};})
},{"./queries":69,"tribe/client/enhancedDebug":97,"underscore":87}],72:[function(require,module,exports){
require("tribe/client/enhancedDebug").execute("module.exports = {\n    'armour': {\n        template: {\n            category: 'a',\n            tile: { content: '[', color: 'white' },\n            interactions: { 'equip': { outcome: 'equip' } }\n}\n    },\n    'plate mail': {\n        inherits: ['armour']\n    }\n};\n//@ sourceURL=http://app/node_modules/objects/types/armour.js\n", arguments, window, require, module, exports);
(function () {module.exports = {
    'armour': {
        template: {
            category: 'a',
            tile: { content: '[', color: 'white' },
            interactions: { 'equip': { outcome: 'equip' } }
}
    },
    'plate mail': {
        inherits: ['armour']
    }
};})
},{"tribe/client/enhancedDebug":97}],73:[function(require,module,exports){
require("tribe/client/enhancedDebug").execute("module.exports = {\n    'creature': {\n        template: {\n            friendly: false,\n            interactions: {\n                'attack': 'attack',\n                'move': false,\n                'acquire': null\n            }\n        }\n    },\n    'human': {\n        inherits: ['creature'], \n        template: {\n            attributes: { speed: 5, health: 20 },\n            tile: { content: '@', color: 'white' },\n            friendly: true\n        }\n    },\n    'dog': { \n        inherits: ['creature'], \n        template: {\n            attributes: { speed: 4, health: 6 },\n            tile: { content: 'd', color: 'brown' },\n            friendly: true\n        }\n    },\n    'orc': {\n        inherits: ['creature'],\n        inventory: [\n            { type: 'gold', quantity: { min: 10, max: 100 }, probability: 1 },\n            { type: 'long sword', probability: 0.2, equipped: true }\n        ],\n        template: {\n            attributes: { speed: 2, health: 7 },\n            tile: { content: 'o', color: 'blue' },\n            behaviours: [{ name: 'attack', options: { criteria: { friendly: true } } }]\n        }\n    }\n};\n//@ sourceURL=http://app/node_modules/objects/types/creatues.js\n", arguments, window, require, module, exports);
(function () {module.exports = {
    'creature': {
        template: {
            friendly: false,
            interactions: {
                'attack': 'attack',
                'move': false,
                'acquire': null
            }
        }
    },
    'human': {
        inherits: ['creature'], 
        template: {
            attributes: { speed: 5, health: 20 },
            tile: { content: '@', color: 'white' },
            friendly: true
        }
    },
    'dog': { 
        inherits: ['creature'], 
        template: {
            attributes: { speed: 4, health: 6 },
            tile: { content: 'd', color: 'brown' },
            friendly: true
        }
    },
    'orc': {
        inherits: ['creature'],
        inventory: [
            { type: 'gold', quantity: { min: 10, max: 100 }, probability: 1 },
            { type: 'long sword', probability: 0.2, equipped: true }
        ],
        template: {
            attributes: { speed: 2, health: 7 },
            tile: { content: 'o', color: 'blue' },
            behaviours: [{ name: 'attack', options: { criteria: { friendly: true } } }]
        }
    }
};})
},{"tribe/client/enhancedDebug":97}],74:[function(require,module,exports){
require("tribe/client/enhancedDebug").execute("module.exports = {\n    'map': {\n        template: {\n            interactions: { 'acquire': false }\n        }\n    },\n    'floor': { \n        inherits: ['map'],\n        template: {\n            interactions: { 'move': { outcome: 'occupy' } },\n            tile: { background: '#222' },\n            occupiable: true\n        }\n    },\n    'passage': { \n        inherits: ['map'],\n        template: {\n            interactions: { 'move': { outcome: 'occupy' } },\n            tile: { background: '#444' },\n            occupiable: true\n        }\n    },\n    'wall': { \n        inherits: ['map'],\n        template: {\n            tile: { background: '#ccc' },\n            obstructs: true\n        }\n    },\n    'door': { \n        inherits: ['map'],\n        template: {\n            interactions: { 'move': { outcome: 'occupy' } },\n            tile: { background: '#333' },\n            occupiable: true\n        }\n    }\n};\n//@ sourceURL=http://app/node_modules/objects/types/map.js\n", arguments, window, require, module, exports);
(function () {module.exports = {
    'map': {
        template: {
            interactions: { 'acquire': false }
        }
    },
    'floor': { 
        inherits: ['map'],
        template: {
            interactions: { 'move': { outcome: 'occupy' } },
            tile: { background: '#222' },
            occupiable: true
        }
    },
    'passage': { 
        inherits: ['map'],
        template: {
            interactions: { 'move': { outcome: 'occupy' } },
            tile: { background: '#444' },
            occupiable: true
        }
    },
    'wall': { 
        inherits: ['map'],
        template: {
            tile: { background: '#ccc' },
            obstructs: true
        }
    },
    'door': { 
        inherits: ['map'],
        template: {
            interactions: { 'move': { outcome: 'occupy' } },
            tile: { background: '#333' },
            occupiable: true
        }
    }
};})
},{"tribe/client/enhancedDebug":97}],75:[function(require,module,exports){
require("tribe/client/enhancedDebug").execute("module.exports = {\n    'gold': { \n        template: {\n            tile: { content: '$', color: 'yellow' },\n            category: 'm'\n        }\n    }\n};\n//@ sourceURL=http://app/node_modules/objects/types/miscellaneous.js\n", arguments, window, require, module, exports);
(function () {module.exports = {
    'gold': { 
        template: {
            tile: { content: '$', color: 'yellow' },
            category: 'm'
        }
    }
};})
},{"tribe/client/enhancedDebug":97}],76:[function(require,module,exports){
require("tribe/client/enhancedDebug").execute("module.exports = {\n    'object': {\n        template: {\n            interactions: { 'acquire': { outcome: 'acquire' } }\n        }\n    }\n};\n//@ sourceURL=http://app/node_modules/objects/types/object.js\n", arguments, window, require, module, exports);
(function () {module.exports = {
    'object': {
        template: {
            interactions: { 'acquire': { outcome: 'acquire' } }
        }
    }
};})
},{"tribe/client/enhancedDebug":97}],77:[function(require,module,exports){
require("tribe/client/enhancedDebug").execute("var generate = require('utilities/generate');\n\nmodule.exports = {\n    'potion': {\n        template: {\n            category: 'p',\n            tile: { content: '!', color: 'white' }\n        }\n    },\n    'healing potion': {\n        inherits: ['potion'],\n        template: {\n            tile: { color: 'lightgreen' },\n            interactions: { 'quaff': { outcomes: [{ outcome: 'damage', applyToSource: true, options: generate.property('value').range(-10, -2)() }, { outcome: 'destroy' }] } }\n        }\n    }\n};\n//@ sourceURL=http://app/node_modules/objects/types/potions.js\n", arguments, window, require, module, exports);
(function () {var generate = require('utilities/generate');

module.exports = {
    'potion': {
        template: {
            category: 'p',
            tile: { content: '!', color: 'white' }
        }
    },
    'healing potion': {
        inherits: ['potion'],
        template: {
            tile: { color: 'lightgreen' },
            interactions: { 'quaff': { outcomes: [{ outcome: 'damage', applyToSource: true, options: generate.property('value').range(-10, -2)() }, { outcome: 'destroy' }] } }
        }
    }
};})
},{"tribe/client/enhancedDebug":97,"utilities/generate":88}],78:[function(require,module,exports){
require("tribe/client/enhancedDebug").execute("module.exports = {\n    'weapon': {\n        template: {\n            category: 'wh',\n            tile: { content: '(', color: 'white' },\n            interactions: { 'equip': { outcome: 'equip' } }\n        }\n    },\n    'ranged weapon': {\n        inherits: ['weapon'],\n        template: {\n            category: 'wr'\n        }\n    },\n    'long sword': {\n        inherits: ['weapon'],\n        template: {\n            damage: { min: 1, max: 8 }\n        }\n    },\n    'short sword': {\n        inherits: ['weapon'],\n        template: {\n            damage: { min: 2, max: 6 }\n        }\n    },\n    'bow': {\n        inherits: ['ranged weapon'],\n        template: {\n            damage: { min: 1, max: 6 }\n        }\n    },\n    'arrow': {\n        inherits: ['weapon'],\n        template: {\n            damage: { min: 1, max: 6 }\n        }\n    }\n};\n//@ sourceURL=http://app/node_modules/objects/types/weapons.js\n", arguments, window, require, module, exports);
(function () {module.exports = {
    'weapon': {
        template: {
            category: 'wh',
            tile: { content: '(', color: 'white' },
            interactions: { 'equip': { outcome: 'equip' } }
        }
    },
    'ranged weapon': {
        inherits: ['weapon'],
        template: {
            category: 'wr'
        }
    },
    'long sword': {
        inherits: ['weapon'],
        template: {
            damage: { min: 1, max: 8 }
        }
    },
    'short sword': {
        inherits: ['weapon'],
        template: {
            damage: { min: 2, max: 6 }
        }
    },
    'bow': {
        inherits: ['ranged weapon'],
        template: {
            damage: { min: 1, max: 6 }
        }
    },
    'arrow': {
        inherits: ['weapon'],
        template: {
            damage: { min: 1, max: 6 }
        }
    }
};})
},{"tribe/client/enhancedDebug":97}],79:[function(require,module,exports){
(function (process){
require("tribe/client/enhancedDebug").execute("// vim:ts=4:sts=4:sw=4:\n/*!\n *\n * Copyright 2009-2012 Kris Kowal under the terms of the MIT\n * license found at http://github.com/kriskowal/q/raw/master/LICENSE\n *\n * With parts by Tyler Close\n * Copyright 2007-2009 Tyler Close under the terms of the MIT X license found\n * at http://www.opensource.org/licenses/mit-license.html\n * Forked at ref_send.js version: 2009-05-11\n *\n * With parts by Mark Miller\n * Copyright (C) 2011 Google Inc.\n *\n * Licensed under the Apache License, Version 2.0 (the \"License\");\n * you may not use this file except in compliance with the License.\n * You may obtain a copy of the License at\n *\n * http://www.apache.org/licenses/LICENSE-2.0\n *\n * Unless required by applicable law or agreed to in writing, software\n * distributed under the License is distributed on an \"AS IS\" BASIS,\n * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n * See the License for the specific language governing permissions and\n * limitations under the License.\n *\n */\n\n(function (definition) {\n    // Turn off strict mode for this function so we can assign to global.Q\n    /* jshint strict: false */\n\n    // This file will function properly as a <script> tag, or a module\n    // using CommonJS and NodeJS or RequireJS module formats.  In\n    // Common/Node/RequireJS, the module exports the Q API and when\n    // executed as a simple <script>, it creates a Q global instead.\n\n    // Montage Require\n    if (typeof bootstrap === \"function\") {\n        bootstrap(\"promise\", definition);\n\n    // CommonJS\n    } else if (typeof exports === \"object\") {\n        module.exports = definition();\n\n    // RequireJS\n    } else if (typeof define === \"function\" && define.amd) {\n        define(definition);\n\n    // SES (Secure EcmaScript)\n    } else if (typeof ses !== \"undefined\") {\n        if (!ses.ok()) {\n            return;\n        } else {\n            ses.makeQ = definition;\n        }\n\n    // <script>\n    } else {\n        Q = definition();\n    }\n\n})(function () {\n\"use strict\";\n\nvar hasStacks = false;\ntry {\n    throw new Error();\n} catch (e) {\n    hasStacks = !!e.stack;\n}\n\n// All code after this point will be filtered from stack traces reported\n// by Q.\nvar qStartingLine = captureLine();\nvar qFileName;\n\n// shims\n\n// used for fallback in \"allResolved\"\nvar noop = function () {};\n\n// Use the fastest possible means to execute a task in a future turn\n// of the event loop.\nvar nextTick =(function () {\n    // linked list of tasks (single, with head node)\n    var head = {task: void 0, next: null};\n    var tail = head;\n    var flushing = false;\n    var requestTick = void 0;\n    var isNodeJS = false;\n\n    function flush() {\n        /* jshint loopfunc: true */\n\n        while (head.next) {\n            head = head.next;\n            var task = head.task;\n            head.task = void 0;\n            var domain = head.domain;\n\n            if (domain) {\n                head.domain = void 0;\n                domain.enter();\n            }\n\n            try {\n                task();\n\n            } catch (e) {\n                if (isNodeJS) {\n                    // In node, uncaught exceptions are considered fatal errors.\n                    // Re-throw them synchronously to interrupt flushing!\n\n                    // Ensure continuation if the uncaught exception is suppressed\n                    // listening \"uncaughtException\" events (as domains does).\n                    // Continue in next event to avoid tick recursion.\n                    if (domain) {\n                        domain.exit();\n                    }\n                    setTimeout(flush, 0);\n                    if (domain) {\n                        domain.enter();\n                    }\n\n                    throw e;\n\n                } else {\n                    // In browsers, uncaught exceptions are not fatal.\n                    // Re-throw them asynchronously to avoid slow-downs.\n                    setTimeout(function() {\n                       throw e;\n                    }, 0);\n                }\n            }\n\n            if (domain) {\n                domain.exit();\n            }\n        }\n\n        flushing = false;\n    }\n\n    nextTick = function (task) {\n        tail = tail.next = {\n            task: task,\n            domain: isNodeJS && process.domain,\n            next: null\n        };\n\n        if (!flushing) {\n            flushing = true;\n            requestTick();\n        }\n    };\n\n    if (typeof process !== \"undefined\" && process.nextTick) {\n        // Node.js before 0.9. Note that some fake-Node environments, like the\n        // Mocha test runner, introduce a `process` global without a `nextTick`.\n        isNodeJS = true;\n\n        requestTick = function () {\n            process.nextTick(flush);\n        };\n\n    } else if (typeof setImmediate === \"function\") {\n        // In IE10, Node.js 0.9+, or https://github.com/NobleJS/setImmediate\n        if (typeof window !== \"undefined\") {\n            requestTick = setImmediate.bind(window, flush);\n        } else {\n            requestTick = function () {\n                setImmediate(flush);\n            };\n        }\n\n    } else if (typeof MessageChannel !== \"undefined\") {\n        // modern browsers\n        // http://www.nonblocking.io/2011/06/windownexttick.html\n        var channel = new MessageChannel();\n        // At least Safari Version 6.0.5 (8536.30.1) intermittently cannot create\n        // working message ports the first time a page loads.\n        channel.port1.onmessage = function () {\n            requestTick = requestPortTick;\n            channel.port1.onmessage = flush;\n            flush();\n        };\n        var requestPortTick = function () {\n            // Opera requires us to provide a message payload, regardless of\n            // whether we use it.\n            channel.port2.postMessage(0);\n        };\n        requestTick = function () {\n            setTimeout(flush, 0);\n            requestPortTick();\n        };\n\n    } else {\n        // old browsers\n        requestTick = function () {\n            setTimeout(flush, 0);\n        };\n    }\n\n    return nextTick;\n})();\n\n// Attempt to make generics safe in the face of downstream\n// modifications.\n// There is no situation where this is necessary.\n// If you need a security guarantee, these primordials need to be\n// deeply frozen anyway, and if you don’t need a security guarantee,\n// this is just plain paranoid.\n// However, this **might** have the nice side-effect of reducing the size of\n// the minified code by reducing x.call() to merely x()\n// See Mark Miller’s explanation of what this does.\n// http://wiki.ecmascript.org/doku.php?id=conventions:safe_meta_programming\nvar call = Function.call;\nfunction uncurryThis(f) {\n    return function () {\n        return call.apply(f, arguments);\n    };\n}\n// This is equivalent, but slower:\n// uncurryThis = Function_bind.bind(Function_bind.call);\n// http://jsperf.com/uncurrythis\n\nvar array_slice = uncurryThis(Array.prototype.slice);\n\nvar array_reduce = uncurryThis(\n    Array.prototype.reduce || function (callback, basis) {\n        var index = 0,\n            length = this.length;\n        // concerning the initial value, if one is not provided\n        if (arguments.length === 1) {\n            // seek to the first value in the array, accounting\n            // for the possibility that is is a sparse array\n            do {\n                if (index in this) {\n                    basis = this[index++];\n                    break;\n                }\n                if (++index >= length) {\n                    throw new TypeError();\n                }\n            } while (1);\n        }\n        // reduce\n        for (; index < length; index++) {\n            // account for the possibility that the array is sparse\n            if (index in this) {\n                basis = callback(basis, this[index], index);\n            }\n        }\n        return basis;\n    }\n);\n\nvar array_indexOf = uncurryThis(\n    Array.prototype.indexOf || function (value) {\n        // not a very good shim, but good enough for our one use of it\n        for (var i = 0; i < this.length; i++) {\n            if (this[i] === value) {\n                return i;\n            }\n        }\n        return -1;\n    }\n);\n\nvar array_map = uncurryThis(\n    Array.prototype.map || function (callback, thisp) {\n        var self = this;\n        var collect = [];\n        array_reduce(self, function (undefined, value, index) {\n            collect.push(callback.call(thisp, value, index, self));\n        }, void 0);\n        return collect;\n    }\n);\n\nvar object_create = Object.create || function (prototype) {\n    function Type() { }\n    Type.prototype = prototype;\n    return new Type();\n};\n\nvar object_hasOwnProperty = uncurryThis(Object.prototype.hasOwnProperty);\n\nvar object_keys = Object.keys || function (object) {\n    var keys = [];\n    for (var key in object) {\n        if (object_hasOwnProperty(object, key)) {\n            keys.push(key);\n        }\n    }\n    return keys;\n};\n\nvar object_toString = uncurryThis(Object.prototype.toString);\n\nfunction isObject(value) {\n    return value === Object(value);\n}\n\n// generator related shims\n\n// FIXME: Remove this function once ES6 generators are in SpiderMonkey.\nfunction isStopIteration(exception) {\n    return (\n        object_toString(exception) === \"[object StopIteration]\" ||\n        exception instanceof QReturnValue\n    );\n}\n\n// FIXME: Remove this helper and Q.return once ES6 generators are in\n// SpiderMonkey.\nvar QReturnValue;\nif (typeof ReturnValue !== \"undefined\") {\n    QReturnValue = ReturnValue;\n} else {\n    QReturnValue = function (value) {\n        this.value = value;\n    };\n}\n\n// long stack traces\n\nvar STACK_JUMP_SEPARATOR = \"From previous event:\";\n\nfunction makeStackTraceLong(error, promise) {\n    // If possible, transform the error stack trace by removing Node and Q\n    // cruft, then concatenating with the stack trace of `promise`. See #57.\n    if (hasStacks &&\n        promise.stack &&\n        typeof error === \"object\" &&\n        error !== null &&\n        error.stack &&\n        error.stack.indexOf(STACK_JUMP_SEPARATOR) === -1\n    ) {\n        var stacks = [];\n        for (var p = promise; !!p; p = p.source) {\n            if (p.stack) {\n                stacks.unshift(p.stack);\n            }\n        }\n        stacks.unshift(error.stack);\n\n        var concatedStacks = stacks.join(\"\\n\" + STACK_JUMP_SEPARATOR + \"\\n\");\n        error.stack = filterStackString(concatedStacks);\n    }\n}\n\nfunction filterStackString(stackString) {\n    var lines = stackString.split(\"\\n\");\n    var desiredLines = [];\n    for (var i = 0; i < lines.length; ++i) {\n        var line = lines[i];\n\n        if (!isInternalFrame(line) && !isNodeFrame(line) && line) {\n            desiredLines.push(line);\n        }\n    }\n    return desiredLines.join(\"\\n\");\n}\n\nfunction isNodeFrame(stackLine) {\n    return stackLine.indexOf(\"(module.js:\") !== -1 ||\n           stackLine.indexOf(\"(node.js:\") !== -1;\n}\n\nfunction getFileNameAndLineNumber(stackLine) {\n    // Named functions: \"at functionName (filename:lineNumber:columnNumber)\"\n    // In IE10 function name can have spaces (\"Anonymous function\") O_o\n    var attempt1 = /at .+ \\((.+):(\\d+):(?:\\d+)\\)$/.exec(stackLine);\n    if (attempt1) {\n        return [attempt1[1], Number(attempt1[2])];\n    }\n\n    // Anonymous functions: \"at filename:lineNumber:columnNumber\"\n    var attempt2 = /at ([^ ]+):(\\d+):(?:\\d+)$/.exec(stackLine);\n    if (attempt2) {\n        return [attempt2[1], Number(attempt2[2])];\n    }\n\n    // Firefox style: \"function@filename:lineNumber or @filename:lineNumber\"\n    var attempt3 = /.*@(.+):(\\d+)$/.exec(stackLine);\n    if (attempt3) {\n        return [attempt3[1], Number(attempt3[2])];\n    }\n}\n\nfunction isInternalFrame(stackLine) {\n    var fileNameAndLineNumber = getFileNameAndLineNumber(stackLine);\n\n    if (!fileNameAndLineNumber) {\n        return false;\n    }\n\n    var fileName = fileNameAndLineNumber[0];\n    var lineNumber = fileNameAndLineNumber[1];\n\n    return fileName === qFileName &&\n        lineNumber >= qStartingLine &&\n        lineNumber <= qEndingLine;\n}\n\n// discover own file name and line number range for filtering stack\n// traces\nfunction captureLine() {\n    if (!hasStacks) {\n        return;\n    }\n\n    try {\n        throw new Error();\n    } catch (e) {\n        var lines = e.stack.split(\"\\n\");\n        var firstLine = lines[0].indexOf(\"@\") > 0 ? lines[1] : lines[2];\n        var fileNameAndLineNumber = getFileNameAndLineNumber(firstLine);\n        if (!fileNameAndLineNumber) {\n            return;\n        }\n\n        qFileName = fileNameAndLineNumber[0];\n        return fileNameAndLineNumber[1];\n    }\n}\n\nfunction deprecate(callback, name, alternative) {\n    return function () {\n        if (typeof console !== \"undefined\" &&\n            typeof console.warn === \"function\") {\n            console.warn(name + \" is deprecated, use \" + alternative +\n                         \" instead.\", new Error(\"\").stack);\n        }\n        return callback.apply(callback, arguments);\n    };\n}\n\n// end of shims\n// beginning of real work\n\n/**\n * Constructs a promise for an immediate reference, passes promises through, or\n * coerces promises from different systems.\n * @param value immediate reference or promise\n */\nfunction Q(value) {\n    // If the object is already a Promise, return it directly.  This enables\n    // the resolve function to both be used to created references from objects,\n    // but to tolerably coerce non-promises to promises.\n    if (isPromise(value)) {\n        return value;\n    }\n\n    // assimilate thenables\n    if (isPromiseAlike(value)) {\n        return coerce(value);\n    } else {\n        return fulfill(value);\n    }\n}\nQ.resolve = Q;\n\n/**\n * Performs a task in a future turn of the event loop.\n * @param {Function} task\n */\nQ.nextTick = nextTick;\n\n/**\n * Controls whether or not long stack traces will be on\n */\nQ.longStackSupport = false;\n\n/**\n * Constructs a {promise, resolve, reject} object.\n *\n * `resolve` is a callback to invoke with a more resolved value for the\n * promise. To fulfill the promise, invoke `resolve` with any value that is\n * not a thenable. To reject the promise, invoke `resolve` with a rejected\n * thenable, or invoke `reject` with the reason directly. To resolve the\n * promise to another thenable, thus putting it in the same state, invoke\n * `resolve` with that other thenable.\n */\nQ.defer = defer;\nfunction defer() {\n    // if \"messages\" is an \"Array\", that indicates that the promise has not yet\n    // been resolved.  If it is \"undefined\", it has been resolved.  Each\n    // element of the messages array is itself an array of complete arguments to\n    // forward to the resolved promise.  We coerce the resolution value to a\n    // promise using the `resolve` function because it handles both fully\n    // non-thenable values and other thenables gracefully.\n    var messages = [], progressListeners = [], resolvedPromise;\n\n    var deferred = object_create(defer.prototype);\n    var promise = object_create(Promise.prototype);\n\n    promise.promiseDispatch = function (resolve, op, operands) {\n        var args = array_slice(arguments);\n        if (messages) {\n            messages.push(args);\n            if (op === \"when\" && operands[1]) { // progress operand\n                progressListeners.push(operands[1]);\n            }\n        } else {\n            nextTick(function () {\n                resolvedPromise.promiseDispatch.apply(resolvedPromise, args);\n            });\n        }\n    };\n\n    // XXX deprecated\n    promise.valueOf = function () {\n        if (messages) {\n            return promise;\n        }\n        var nearerValue = nearer(resolvedPromise);\n        if (isPromise(nearerValue)) {\n            resolvedPromise = nearerValue; // shorten chain\n        }\n        return nearerValue;\n    };\n\n    promise.inspect = function () {\n        if (!resolvedPromise) {\n            return { state: \"pending\" };\n        }\n        return resolvedPromise.inspect();\n    };\n\n    if (Q.longStackSupport && hasStacks) {\n        try {\n            throw new Error();\n        } catch (e) {\n            // NOTE: don't try to use `Error.captureStackTrace` or transfer the\n            // accessor around; that causes memory leaks as per GH-111. Just\n            // reify the stack trace as a string ASAP.\n            //\n            // At the same time, cut off the first line; it's always just\n            // \"[object Promise]\\n\", as per the `toString`.\n            promise.stack = e.stack.substring(e.stack.indexOf(\"\\n\") + 1);\n        }\n    }\n\n    // NOTE: we do the checks for `resolvedPromise` in each method, instead of\n    // consolidating them into `become`, since otherwise we'd create new\n    // promises with the lines `become(whatever(value))`. See e.g. GH-252.\n\n    function become(newPromise) {\n        resolvedPromise = newPromise;\n        promise.source = newPromise;\n\n        array_reduce(messages, function (undefined, message) {\n            nextTick(function () {\n                newPromise.promiseDispatch.apply(newPromise, message);\n            });\n        }, void 0);\n\n        messages = void 0;\n        progressListeners = void 0;\n    }\n\n    deferred.promise = promise;\n    deferred.resolve = function (value) {\n        if (resolvedPromise) {\n            return;\n        }\n\n        become(Q(value));\n    };\n\n    deferred.fulfill = function (value) {\n        if (resolvedPromise) {\n            return;\n        }\n\n        become(fulfill(value));\n    };\n    deferred.reject = function (reason) {\n        if (resolvedPromise) {\n            return;\n        }\n\n        become(reject(reason));\n    };\n    deferred.notify = function (progress) {\n        if (resolvedPromise) {\n            return;\n        }\n\n        array_reduce(progressListeners, function (undefined, progressListener) {\n            nextTick(function () {\n                progressListener(progress);\n            });\n        }, void 0);\n    };\n\n    return deferred;\n}\n\n/**\n * Creates a Node-style callback that will resolve or reject the deferred\n * promise.\n * @returns a nodeback\n */\ndefer.prototype.makeNodeResolver = function () {\n    var self = this;\n    return function (error, value) {\n        if (error) {\n            self.reject(error);\n        } else if (arguments.length > 2) {\n            self.resolve(array_slice(arguments, 1));\n        } else {\n            self.resolve(value);\n        }\n    };\n};\n\n/**\n * @param resolver {Function} a function that returns nothing and accepts\n * the resolve, reject, and notify functions for a deferred.\n * @returns a promise that may be resolved with the given resolve and reject\n * functions, or rejected by a thrown exception in resolver\n */\nQ.Promise = promise; // ES6\nQ.promise = promise;\nfunction promise(resolver) {\n    if (typeof resolver !== \"function\") {\n        throw new TypeError(\"resolver must be a function.\");\n    }\n    var deferred = defer();\n    try {\n        resolver(deferred.resolve, deferred.reject, deferred.notify);\n    } catch (reason) {\n        deferred.reject(reason);\n    }\n    return deferred.promise;\n}\n\npromise.race = race; // ES6\npromise.all = all; // ES6\npromise.reject = reject; // ES6\npromise.resolve = Q; // ES6\n\n// XXX experimental.  This method is a way to denote that a local value is\n// serializable and should be immediately dispatched to a remote upon request,\n// instead of passing a reference.\nQ.passByCopy = function (object) {\n    //freeze(object);\n    //passByCopies.set(object, true);\n    return object;\n};\n\nPromise.prototype.passByCopy = function () {\n    //freeze(object);\n    //passByCopies.set(object, true);\n    return this;\n};\n\n/**\n * If two promises eventually fulfill to the same value, promises that value,\n * but otherwise rejects.\n * @param x {Any*}\n * @param y {Any*}\n * @returns {Any*} a promise for x and y if they are the same, but a rejection\n * otherwise.\n *\n */\nQ.join = function (x, y) {\n    return Q(x).join(y);\n};\n\nPromise.prototype.join = function (that) {\n    return Q([this, that]).spread(function (x, y) {\n        if (x === y) {\n            // TODO: \"===\" should be Object.is or equiv\n            return x;\n        } else {\n            throw new Error(\"Can't join: not the same: \" + x + \" \" + y);\n        }\n    });\n};\n\n/**\n * Returns a promise for the first of an array of promises to become fulfilled.\n * @param answers {Array[Any*]} promises to race\n * @returns {Any*} the first promise to be fulfilled\n */\nQ.race = race;\nfunction race(answerPs) {\n    return promise(function(resolve, reject) {\n        // Switch to this once we can assume at least ES5\n        // answerPs.forEach(function(answerP) {\n        //     Q(answerP).then(resolve, reject);\n        // });\n        // Use this in the meantime\n        for (var i = 0, len = answerPs.length; i < len; i++) {\n            Q(answerPs[i]).then(resolve, reject);\n        }\n    });\n}\n\nPromise.prototype.race = function () {\n    return this.then(Q.race);\n};\n\n/**\n * Constructs a Promise with a promise descriptor object and optional fallback\n * function.  The descriptor contains methods like when(rejected), get(name),\n * set(name, value), post(name, args), and delete(name), which all\n * return either a value, a promise for a value, or a rejection.  The fallback\n * accepts the operation name, a resolver, and any further arguments that would\n * have been forwarded to the appropriate method above had a method been\n * provided with the proper name.  The API makes no guarantees about the nature\n * of the returned object, apart from that it is usable whereever promises are\n * bought and sold.\n */\nQ.makePromise = Promise;\nfunction Promise(descriptor, fallback, inspect) {\n    if (fallback === void 0) {\n        fallback = function (op) {\n            return reject(new Error(\n                \"Promise does not support operation: \" + op\n            ));\n        };\n    }\n    if (inspect === void 0) {\n        inspect = function () {\n            return {state: \"unknown\"};\n        };\n    }\n\n    var promise = object_create(Promise.prototype);\n\n    promise.promiseDispatch = function (resolve, op, args) {\n        var result;\n        try {\n            if (descriptor[op]) {\n                result = descriptor[op].apply(promise, args);\n            } else {\n                result = fallback.call(promise, op, args);\n            }\n        } catch (exception) {\n            result = reject(exception);\n        }\n        if (resolve) {\n            resolve(result);\n        }\n    };\n\n    promise.inspect = inspect;\n\n    // XXX deprecated `valueOf` and `exception` support\n    if (inspect) {\n        var inspected = inspect();\n        if (inspected.state === \"rejected\") {\n            promise.exception = inspected.reason;\n        }\n\n        promise.valueOf = function () {\n            var inspected = inspect();\n            if (inspected.state === \"pending\" ||\n                inspected.state === \"rejected\") {\n                return promise;\n            }\n            return inspected.value;\n        };\n    }\n\n    return promise;\n}\n\nPromise.prototype.toString = function () {\n    return \"[object Promise]\";\n};\n\nPromise.prototype.then = function (fulfilled, rejected, progressed) {\n    var self = this;\n    var deferred = defer();\n    var done = false;   // ensure the untrusted promise makes at most a\n                        // single call to one of the callbacks\n\n    function _fulfilled(value) {\n        try {\n            return typeof fulfilled === \"function\" ? fulfilled(value) : value;\n        } catch (exception) {\n            return reject(exception);\n        }\n    }\n\n    function _rejected(exception) {\n        if (typeof rejected === \"function\") {\n            makeStackTraceLong(exception, self);\n            try {\n                return rejected(exception);\n            } catch (newException) {\n                return reject(newException);\n            }\n        }\n        return reject(exception);\n    }\n\n    function _progressed(value) {\n        return typeof progressed === \"function\" ? progressed(value) : value;\n    }\n\n    nextTick(function () {\n        self.promiseDispatch(function (value) {\n            if (done) {\n                return;\n            }\n            done = true;\n\n            deferred.resolve(_fulfilled(value));\n        }, \"when\", [function (exception) {\n            if (done) {\n                return;\n            }\n            done = true;\n\n            deferred.resolve(_rejected(exception));\n        }]);\n    });\n\n    // Progress propagator need to be attached in the current tick.\n    self.promiseDispatch(void 0, \"when\", [void 0, function (value) {\n        var newValue;\n        var threw = false;\n        try {\n            newValue = _progressed(value);\n        } catch (e) {\n            threw = true;\n            if (Q.onerror) {\n                Q.onerror(e);\n            } else {\n                throw e;\n            }\n        }\n\n        if (!threw) {\n            deferred.notify(newValue);\n        }\n    }]);\n\n    return deferred.promise;\n};\n\n/**\n * Registers an observer on a promise.\n *\n * Guarantees:\n *\n * 1. that fulfilled and rejected will be called only once.\n * 2. that either the fulfilled callback or the rejected callback will be\n *    called, but not both.\n * 3. that fulfilled and rejected will not be called in this turn.\n *\n * @param value      promise or immediate reference to observe\n * @param fulfilled  function to be called with the fulfilled value\n * @param rejected   function to be called with the rejection exception\n * @param progressed function to be called on any progress notifications\n * @return promise for the return value from the invoked callback\n */\nQ.when = when;\nfunction when(value, fulfilled, rejected, progressed) {\n    return Q(value).then(fulfilled, rejected, progressed);\n}\n\nPromise.prototype.thenResolve = function (value) {\n    return this.then(function () { return value; });\n};\n\nQ.thenResolve = function (promise, value) {\n    return Q(promise).thenResolve(value);\n};\n\nPromise.prototype.thenReject = function (reason) {\n    return this.then(function () { throw reason; });\n};\n\nQ.thenReject = function (promise, reason) {\n    return Q(promise).thenReject(reason);\n};\n\n/**\n * If an object is not a promise, it is as \"near\" as possible.\n * If a promise is rejected, it is as \"near\" as possible too.\n * If it’s a fulfilled promise, the fulfillment value is nearer.\n * If it’s a deferred promise and the deferred has been resolved, the\n * resolution is \"nearer\".\n * @param object\n * @returns most resolved (nearest) form of the object\n */\n\n// XXX should we re-do this?\nQ.nearer = nearer;\nfunction nearer(value) {\n    if (isPromise(value)) {\n        var inspected = value.inspect();\n        if (inspected.state === \"fulfilled\") {\n            return inspected.value;\n        }\n    }\n    return value;\n}\n\n/**\n * @returns whether the given object is a promise.\n * Otherwise it is a fulfilled value.\n */\nQ.isPromise = isPromise;\nfunction isPromise(object) {\n    return isObject(object) &&\n        typeof object.promiseDispatch === \"function\" &&\n        typeof object.inspect === \"function\";\n}\n\nQ.isPromiseAlike = isPromiseAlike;\nfunction isPromiseAlike(object) {\n    return isObject(object) && typeof object.then === \"function\";\n}\n\n/**\n * @returns whether the given object is a pending promise, meaning not\n * fulfilled or rejected.\n */\nQ.isPending = isPending;\nfunction isPending(object) {\n    return isPromise(object) && object.inspect().state === \"pending\";\n}\n\nPromise.prototype.isPending = function () {\n    return this.inspect().state === \"pending\";\n};\n\n/**\n * @returns whether the given object is a value or fulfilled\n * promise.\n */\nQ.isFulfilled = isFulfilled;\nfunction isFulfilled(object) {\n    return !isPromise(object) || object.inspect().state === \"fulfilled\";\n}\n\nPromise.prototype.isFulfilled = function () {\n    return this.inspect().state === \"fulfilled\";\n};\n\n/**\n * @returns whether the given object is a rejected promise.\n */\nQ.isRejected = isRejected;\nfunction isRejected(object) {\n    return isPromise(object) && object.inspect().state === \"rejected\";\n}\n\nPromise.prototype.isRejected = function () {\n    return this.inspect().state === \"rejected\";\n};\n\n//// BEGIN UNHANDLED REJECTION TRACKING\n\n// This promise library consumes exceptions thrown in handlers so they can be\n// handled by a subsequent promise.  The exceptions get added to this array when\n// they are created, and removed when they are handled.  Note that in ES6 or\n// shimmed environments, this would naturally be a `Set`.\nvar unhandledReasons = [];\nvar unhandledRejections = [];\nvar trackUnhandledRejections = true;\n\nfunction resetUnhandledRejections() {\n    unhandledReasons.length = 0;\n    unhandledRejections.length = 0;\n\n    if (!trackUnhandledRejections) {\n        trackUnhandledRejections = true;\n    }\n}\n\nfunction trackRejection(promise, reason) {\n    if (!trackUnhandledRejections) {\n        return;\n    }\n\n    unhandledRejections.push(promise);\n    if (reason && typeof reason.stack !== \"undefined\") {\n        unhandledReasons.push(reason.stack);\n    } else {\n        unhandledReasons.push(\"(no stack) \" + reason);\n    }\n}\n\nfunction untrackRejection(promise) {\n    if (!trackUnhandledRejections) {\n        return;\n    }\n\n    var at = array_indexOf(unhandledRejections, promise);\n    if (at !== -1) {\n        unhandledRejections.splice(at, 1);\n        unhandledReasons.splice(at, 1);\n    }\n}\n\nQ.resetUnhandledRejections = resetUnhandledRejections;\n\nQ.getUnhandledReasons = function () {\n    // Make a copy so that consumers can't interfere with our internal state.\n    return unhandledReasons.slice();\n};\n\nQ.stopUnhandledRejectionTracking = function () {\n    resetUnhandledRejections();\n    trackUnhandledRejections = false;\n};\n\nresetUnhandledRejections();\n\n//// END UNHANDLED REJECTION TRACKING\n\n/**\n * Constructs a rejected promise.\n * @param reason value describing the failure\n */\nQ.reject = reject;\nfunction reject(reason) {\n    var rejection = Promise({\n        \"when\": function (rejected) {\n            // note that the error has been handled\n            if (rejected) {\n                untrackRejection(this);\n            }\n            return rejected ? rejected(reason) : this;\n        }\n    }, function fallback() {\n        return this;\n    }, function inspect() {\n        return { state: \"rejected\", reason: reason };\n    });\n\n    // Note that the reason has not been handled.\n    trackRejection(rejection, reason);\n\n    return rejection;\n}\n\n/**\n * Constructs a fulfilled promise for an immediate reference.\n * @param value immediate reference\n */\nQ.fulfill = fulfill;\nfunction fulfill(value) {\n    return Promise({\n        \"when\": function () {\n            return value;\n        },\n        \"get\": function (name) {\n            return value[name];\n        },\n        \"set\": function (name, rhs) {\n            value[name] = rhs;\n        },\n        \"delete\": function (name) {\n            delete value[name];\n        },\n        \"post\": function (name, args) {\n            // Mark Miller proposes that post with no name should apply a\n            // promised function.\n            if (name === null || name === void 0) {\n                return value.apply(void 0, args);\n            } else {\n                return value[name].apply(value, args);\n            }\n        },\n        \"apply\": function (thisp, args) {\n            return value.apply(thisp, args);\n        },\n        \"keys\": function () {\n            return object_keys(value);\n        }\n    }, void 0, function inspect() {\n        return { state: \"fulfilled\", value: value };\n    });\n}\n\n/**\n * Converts thenables to Q promises.\n * @param promise thenable promise\n * @returns a Q promise\n */\nfunction coerce(promise) {\n    var deferred = defer();\n    nextTick(function () {\n        try {\n            promise.then(deferred.resolve, deferred.reject, deferred.notify);\n        } catch (exception) {\n            deferred.reject(exception);\n        }\n    });\n    return deferred.promise;\n}\n\n/**\n * Annotates an object such that it will never be\n * transferred away from this process over any promise\n * communication channel.\n * @param object\n * @returns promise a wrapping of that object that\n * additionally responds to the \"isDef\" message\n * without a rejection.\n */\nQ.master = master;\nfunction master(object) {\n    return Promise({\n        \"isDef\": function () {}\n    }, function fallback(op, args) {\n        return dispatch(object, op, args);\n    }, function () {\n        return Q(object).inspect();\n    });\n}\n\n/**\n * Spreads the values of a promised array of arguments into the\n * fulfillment callback.\n * @param fulfilled callback that receives variadic arguments from the\n * promised array\n * @param rejected callback that receives the exception if the promise\n * is rejected.\n * @returns a promise for the return value or thrown exception of\n * either callback.\n */\nQ.spread = spread;\nfunction spread(value, fulfilled, rejected) {\n    return Q(value).spread(fulfilled, rejected);\n}\n\nPromise.prototype.spread = function (fulfilled, rejected) {\n    return this.all().then(function (array) {\n        return fulfilled.apply(void 0, array);\n    }, rejected);\n};\n\n/**\n * The async function is a decorator for generator functions, turning\n * them into asynchronous generators.  Although generators are only part\n * of the newest ECMAScript 6 drafts, this code does not cause syntax\n * errors in older engines.  This code should continue to work and will\n * in fact improve over time as the language improves.\n *\n * ES6 generators are currently part of V8 version 3.19 with the\n * --harmony-generators runtime flag enabled.  SpiderMonkey has had them\n * for longer, but under an older Python-inspired form.  This function\n * works on both kinds of generators.\n *\n * Decorates a generator function such that:\n *  - it may yield promises\n *  - execution will continue when that promise is fulfilled\n *  - the value of the yield expression will be the fulfilled value\n *  - it returns a promise for the return value (when the generator\n *    stops iterating)\n *  - the decorated function returns a promise for the return value\n *    of the generator or the first rejected promise among those\n *    yielded.\n *  - if an error is thrown in the generator, it propagates through\n *    every following yield until it is caught, or until it escapes\n *    the generator function altogether, and is translated into a\n *    rejection for the promise returned by the decorated generator.\n */\nQ.async = async;\nfunction async(makeGenerator) {\n    return function () {\n        // when verb is \"send\", arg is a value\n        // when verb is \"throw\", arg is an exception\n        function continuer(verb, arg) {\n            var result;\n\n            // Until V8 3.19 / Chromium 29 is released, SpiderMonkey is the only\n            // engine that has a deployed base of browsers that support generators.\n            // However, SM's generators use the Python-inspired semantics of\n            // outdated ES6 drafts.  We would like to support ES6, but we'd also\n            // like to make it possible to use generators in deployed browsers, so\n            // we also support Python-style generators.  At some point we can remove\n            // this block.\n\n            if (typeof StopIteration === \"undefined\") {\n                // ES6 Generators\n                try {\n                    result = generator[verb](arg);\n                } catch (exception) {\n                    return reject(exception);\n                }\n                if (result.done) {\n                    return result.value;\n                } else {\n                    return when(result.value, callback, errback);\n                }\n            } else {\n                // SpiderMonkey Generators\n                // FIXME: Remove this case when SM does ES6 generators.\n                try {\n                    result = generator[verb](arg);\n                } catch (exception) {\n                    if (isStopIteration(exception)) {\n                        return exception.value;\n                    } else {\n                        return reject(exception);\n                    }\n                }\n                return when(result, callback, errback);\n            }\n        }\n        var generator = makeGenerator.apply(this, arguments);\n        var callback = continuer.bind(continuer, \"next\");\n        var errback = continuer.bind(continuer, \"throw\");\n        return callback();\n    };\n}\n\n/**\n * The spawn function is a small wrapper around async that immediately\n * calls the generator and also ends the promise chain, so that any\n * unhandled errors are thrown instead of forwarded to the error\n * handler. This is useful because it's extremely common to run\n * generators at the top-level to work with libraries.\n */\nQ.spawn = spawn;\nfunction spawn(makeGenerator) {\n    Q.done(Q.async(makeGenerator)());\n}\n\n// FIXME: Remove this interface once ES6 generators are in SpiderMonkey.\n/**\n * Throws a ReturnValue exception to stop an asynchronous generator.\n *\n * This interface is a stop-gap measure to support generator return\n * values in older Firefox/SpiderMonkey.  In browsers that support ES6\n * generators like Chromium 29, just use \"return\" in your generator\n * functions.\n *\n * @param value the return value for the surrounding generator\n * @throws ReturnValue exception with the value.\n * @example\n * // ES6 style\n * Q.async(function* () {\n *      var foo = yield getFooPromise();\n *      var bar = yield getBarPromise();\n *      return foo + bar;\n * })\n * // Older SpiderMonkey style\n * Q.async(function () {\n *      var foo = yield getFooPromise();\n *      var bar = yield getBarPromise();\n *      Q.return(foo + bar);\n * })\n */\nQ[\"return\"] = _return;\nfunction _return(value) {\n    throw new QReturnValue(value);\n}\n\n/**\n * The promised function decorator ensures that any promise arguments\n * are settled and passed as values (`this` is also settled and passed\n * as a value).  It will also ensure that the result of a function is\n * always a promise.\n *\n * @example\n * var add = Q.promised(function (a, b) {\n *     return a + b;\n * });\n * add(Q(a), Q(B));\n *\n * @param {function} callback The function to decorate\n * @returns {function} a function that has been decorated.\n */\nQ.promised = promised;\nfunction promised(callback) {\n    return function () {\n        return spread([this, all(arguments)], function (self, args) {\n            return callback.apply(self, args);\n        });\n    };\n}\n\n/**\n * sends a message to a value in a future turn\n * @param object* the recipient\n * @param op the name of the message operation, e.g., \"when\",\n * @param args further arguments to be forwarded to the operation\n * @returns result {Promise} a promise for the result of the operation\n */\nQ.dispatch = dispatch;\nfunction dispatch(object, op, args) {\n    return Q(object).dispatch(op, args);\n}\n\nPromise.prototype.dispatch = function (op, args) {\n    var self = this;\n    var deferred = defer();\n    nextTick(function () {\n        self.promiseDispatch(deferred.resolve, op, args);\n    });\n    return deferred.promise;\n};\n\n/**\n * Gets the value of a property in a future turn.\n * @param object    promise or immediate reference for target object\n * @param name      name of property to get\n * @return promise for the property value\n */\nQ.get = function (object, key) {\n    return Q(object).dispatch(\"get\", [key]);\n};\n\nPromise.prototype.get = function (key) {\n    return this.dispatch(\"get\", [key]);\n};\n\n/**\n * Sets the value of a property in a future turn.\n * @param object    promise or immediate reference for object object\n * @param name      name of property to set\n * @param value     new value of property\n * @return promise for the return value\n */\nQ.set = function (object, key, value) {\n    return Q(object).dispatch(\"set\", [key, value]);\n};\n\nPromise.prototype.set = function (key, value) {\n    return this.dispatch(\"set\", [key, value]);\n};\n\n/**\n * Deletes a property in a future turn.\n * @param object    promise or immediate reference for target object\n * @param name      name of property to delete\n * @return promise for the return value\n */\nQ.del = // XXX legacy\nQ[\"delete\"] = function (object, key) {\n    return Q(object).dispatch(\"delete\", [key]);\n};\n\nPromise.prototype.del = // XXX legacy\nPromise.prototype[\"delete\"] = function (key) {\n    return this.dispatch(\"delete\", [key]);\n};\n\n/**\n * Invokes a method in a future turn.\n * @param object    promise or immediate reference for target object\n * @param name      name of method to invoke\n * @param value     a value to post, typically an array of\n *                  invocation arguments for promises that\n *                  are ultimately backed with `resolve` values,\n *                  as opposed to those backed with URLs\n *                  wherein the posted value can be any\n *                  JSON serializable object.\n * @return promise for the return value\n */\n// bound locally because it is used by other methods\nQ.mapply = // XXX As proposed by \"Redsandro\"\nQ.post = function (object, name, args) {\n    return Q(object).dispatch(\"post\", [name, args]);\n};\n\nPromise.prototype.mapply = // XXX As proposed by \"Redsandro\"\nPromise.prototype.post = function (name, args) {\n    return this.dispatch(\"post\", [name, args]);\n};\n\n/**\n * Invokes a method in a future turn.\n * @param object    promise or immediate reference for target object\n * @param name      name of method to invoke\n * @param ...args   array of invocation arguments\n * @return promise for the return value\n */\nQ.send = // XXX Mark Miller's proposed parlance\nQ.mcall = // XXX As proposed by \"Redsandro\"\nQ.invoke = function (object, name /*...args*/) {\n    return Q(object).dispatch(\"post\", [name, array_slice(arguments, 2)]);\n};\n\nPromise.prototype.send = // XXX Mark Miller's proposed parlance\nPromise.prototype.mcall = // XXX As proposed by \"Redsandro\"\nPromise.prototype.invoke = function (name /*...args*/) {\n    return this.dispatch(\"post\", [name, array_slice(arguments, 1)]);\n};\n\n/**\n * Applies the promised function in a future turn.\n * @param object    promise or immediate reference for target function\n * @param args      array of application arguments\n */\nQ.fapply = function (object, args) {\n    return Q(object).dispatch(\"apply\", [void 0, args]);\n};\n\nPromise.prototype.fapply = function (args) {\n    return this.dispatch(\"apply\", [void 0, args]);\n};\n\n/**\n * Calls the promised function in a future turn.\n * @param object    promise or immediate reference for target function\n * @param ...args   array of application arguments\n */\nQ[\"try\"] =\nQ.fcall = function (object /* ...args*/) {\n    return Q(object).dispatch(\"apply\", [void 0, array_slice(arguments, 1)]);\n};\n\nPromise.prototype.fcall = function (/*...args*/) {\n    return this.dispatch(\"apply\", [void 0, array_slice(arguments)]);\n};\n\n/**\n * Binds the promised function, transforming return values into a fulfilled\n * promise and thrown errors into a rejected one.\n * @param object    promise or immediate reference for target function\n * @param ...args   array of application arguments\n */\nQ.fbind = function (object /*...args*/) {\n    var promise = Q(object);\n    var args = array_slice(arguments, 1);\n    return function fbound() {\n        return promise.dispatch(\"apply\", [\n            this,\n            args.concat(array_slice(arguments))\n        ]);\n    };\n};\nPromise.prototype.fbind = function (/*...args*/) {\n    var promise = this;\n    var args = array_slice(arguments);\n    return function fbound() {\n        return promise.dispatch(\"apply\", [\n            this,\n            args.concat(array_slice(arguments))\n        ]);\n    };\n};\n\n/**\n * Requests the names of the owned properties of a promised\n * object in a future turn.\n * @param object    promise or immediate reference for target object\n * @return promise for the keys of the eventually settled object\n */\nQ.keys = function (object) {\n    return Q(object).dispatch(\"keys\", []);\n};\n\nPromise.prototype.keys = function () {\n    return this.dispatch(\"keys\", []);\n};\n\n/**\n * Turns an array of promises into a promise for an array.  If any of\n * the promises gets rejected, the whole array is rejected immediately.\n * @param {Array*} an array (or promise for an array) of values (or\n * promises for values)\n * @returns a promise for an array of the corresponding values\n */\n// By Mark Miller\n// http://wiki.ecmascript.org/doku.php?id=strawman:concurrency&rev=1308776521#allfulfilled\nQ.all = all;\nfunction all(promises) {\n    return when(promises, function (promises) {\n        var countDown = 0;\n        var deferred = defer();\n        array_reduce(promises, function (undefined, promise, index) {\n            var snapshot;\n            if (\n                isPromise(promise) &&\n                (snapshot = promise.inspect()).state === \"fulfilled\"\n            ) {\n                promises[index] = snapshot.value;\n            } else {\n                ++countDown;\n                when(\n                    promise,\n                    function (value) {\n                        promises[index] = value;\n                        if (--countDown === 0) {\n                            deferred.resolve(promises);\n                        }\n                    },\n                    deferred.reject,\n                    function (progress) {\n                        deferred.notify({ index: index, value: progress });\n                    }\n                );\n            }\n        }, void 0);\n        if (countDown === 0) {\n            deferred.resolve(promises);\n        }\n        return deferred.promise;\n    });\n}\n\nPromise.prototype.all = function () {\n    return all(this);\n};\n\n/**\n * Waits for all promises to be settled, either fulfilled or\n * rejected.  This is distinct from `all` since that would stop\n * waiting at the first rejection.  The promise returned by\n * `allResolved` will never be rejected.\n * @param promises a promise for an array (or an array) of promises\n * (or values)\n * @return a promise for an array of promises\n */\nQ.allResolved = deprecate(allResolved, \"allResolved\", \"allSettled\");\nfunction allResolved(promises) {\n    return when(promises, function (promises) {\n        promises = array_map(promises, Q);\n        return when(all(array_map(promises, function (promise) {\n            return when(promise, noop, noop);\n        })), function () {\n            return promises;\n        });\n    });\n}\n\nPromise.prototype.allResolved = function () {\n    return allResolved(this);\n};\n\n/**\n * @see Promise#allSettled\n */\nQ.allSettled = allSettled;\nfunction allSettled(promises) {\n    return Q(promises).allSettled();\n}\n\n/**\n * Turns an array of promises into a promise for an array of their states (as\n * returned by `inspect`) when they have all settled.\n * @param {Array[Any*]} values an array (or promise for an array) of values (or\n * promises for values)\n * @returns {Array[State]} an array of states for the respective values.\n */\nPromise.prototype.allSettled = function () {\n    return this.then(function (promises) {\n        return all(array_map(promises, function (promise) {\n            promise = Q(promise);\n            function regardless() {\n                return promise.inspect();\n            }\n            return promise.then(regardless, regardless);\n        }));\n    });\n};\n\n/**\n * Captures the failure of a promise, giving an oportunity to recover\n * with a callback.  If the given promise is fulfilled, the returned\n * promise is fulfilled.\n * @param {Any*} promise for something\n * @param {Function} callback to fulfill the returned promise if the\n * given promise is rejected\n * @returns a promise for the return value of the callback\n */\nQ.fail = // XXX legacy\nQ[\"catch\"] = function (object, rejected) {\n    return Q(object).then(void 0, rejected);\n};\n\nPromise.prototype.fail = // XXX legacy\nPromise.prototype[\"catch\"] = function (rejected) {\n    return this.then(void 0, rejected);\n};\n\n/**\n * Attaches a listener that can respond to progress notifications from a\n * promise's originating deferred. This listener receives the exact arguments\n * passed to ``deferred.notify``.\n * @param {Any*} promise for something\n * @param {Function} callback to receive any progress notifications\n * @returns the given promise, unchanged\n */\nQ.progress = progress;\nfunction progress(object, progressed) {\n    return Q(object).then(void 0, void 0, progressed);\n}\n\nPromise.prototype.progress = function (progressed) {\n    return this.then(void 0, void 0, progressed);\n};\n\n/**\n * Provides an opportunity to observe the settling of a promise,\n * regardless of whether the promise is fulfilled or rejected.  Forwards\n * the resolution to the returned promise when the callback is done.\n * The callback can return a promise to defer completion.\n * @param {Any*} promise\n * @param {Function} callback to observe the resolution of the given\n * promise, takes no arguments.\n * @returns a promise for the resolution of the given promise when\n * ``fin`` is done.\n */\nQ.fin = // XXX legacy\nQ[\"finally\"] = function (object, callback) {\n    return Q(object)[\"finally\"](callback);\n};\n\nPromise.prototype.fin = // XXX legacy\nPromise.prototype[\"finally\"] = function (callback) {\n    callback = Q(callback);\n    return this.then(function (value) {\n        return callback.fcall().then(function () {\n            return value;\n        });\n    }, function (reason) {\n        // TODO attempt to recycle the rejection with \"this\".\n        return callback.fcall().then(function () {\n            throw reason;\n        });\n    });\n};\n\n/**\n * Terminates a chain of promises, forcing rejections to be\n * thrown as exceptions.\n * @param {Any*} promise at the end of a chain of promises\n * @returns nothing\n */\nQ.done = function (object, fulfilled, rejected, progress) {\n    return Q(object).done(fulfilled, rejected, progress);\n};\n\nPromise.prototype.done = function (fulfilled, rejected, progress) {\n    var onUnhandledError = function (error) {\n        // forward to a future turn so that ``when``\n        // does not catch it and turn it into a rejection.\n        nextTick(function () {\n            makeStackTraceLong(error, promise);\n            if (Q.onerror) {\n                Q.onerror(error);\n            } else {\n                throw error;\n            }\n        });\n    };\n\n    // Avoid unnecessary `nextTick`ing via an unnecessary `when`.\n    var promise = fulfilled || rejected || progress ?\n        this.then(fulfilled, rejected, progress) :\n        this;\n\n    if (typeof process === \"object\" && process && process.domain) {\n        onUnhandledError = process.domain.bind(onUnhandledError);\n    }\n\n    promise.then(void 0, onUnhandledError);\n};\n\n/**\n * Causes a promise to be rejected if it does not get fulfilled before\n * some milliseconds time out.\n * @param {Any*} promise\n * @param {Number} milliseconds timeout\n * @param {String} custom error message (optional)\n * @returns a promise for the resolution of the given promise if it is\n * fulfilled before the timeout, otherwise rejected.\n */\nQ.timeout = function (object, ms, message) {\n    return Q(object).timeout(ms, message);\n};\n\nPromise.prototype.timeout = function (ms, message) {\n    var deferred = defer();\n    var timeoutId = setTimeout(function () {\n        deferred.reject(new Error(message || \"Timed out after \" + ms + \" ms\"));\n    }, ms);\n\n    this.then(function (value) {\n        clearTimeout(timeoutId);\n        deferred.resolve(value);\n    }, function (exception) {\n        clearTimeout(timeoutId);\n        deferred.reject(exception);\n    }, deferred.notify);\n\n    return deferred.promise;\n};\n\n/**\n * Returns a promise for the given value (or promised value), some\n * milliseconds after it resolved. Passes rejections immediately.\n * @param {Any*} promise\n * @param {Number} milliseconds\n * @returns a promise for the resolution of the given promise after milliseconds\n * time has elapsed since the resolution of the given promise.\n * If the given promise rejects, that is passed immediately.\n */\nQ.delay = function (object, timeout) {\n    if (timeout === void 0) {\n        timeout = object;\n        object = void 0;\n    }\n    return Q(object).delay(timeout);\n};\n\nPromise.prototype.delay = function (timeout) {\n    return this.then(function (value) {\n        var deferred = defer();\n        setTimeout(function () {\n            deferred.resolve(value);\n        }, timeout);\n        return deferred.promise;\n    });\n};\n\n/**\n * Passes a continuation to a Node function, which is called with the given\n * arguments provided as an array, and returns a promise.\n *\n *      Q.nfapply(FS.readFile, [__filename])\n *      .then(function (content) {\n *      })\n *\n */\nQ.nfapply = function (callback, args) {\n    return Q(callback).nfapply(args);\n};\n\nPromise.prototype.nfapply = function (args) {\n    var deferred = defer();\n    var nodeArgs = array_slice(args);\n    nodeArgs.push(deferred.makeNodeResolver());\n    this.fapply(nodeArgs).fail(deferred.reject);\n    return deferred.promise;\n};\n\n/**\n * Passes a continuation to a Node function, which is called with the given\n * arguments provided individually, and returns a promise.\n * @example\n * Q.nfcall(FS.readFile, __filename)\n * .then(function (content) {\n * })\n *\n */\nQ.nfcall = function (callback /*...args*/) {\n    var args = array_slice(arguments, 1);\n    return Q(callback).nfapply(args);\n};\n\nPromise.prototype.nfcall = function (/*...args*/) {\n    var nodeArgs = array_slice(arguments);\n    var deferred = defer();\n    nodeArgs.push(deferred.makeNodeResolver());\n    this.fapply(nodeArgs).fail(deferred.reject);\n    return deferred.promise;\n};\n\n/**\n * Wraps a NodeJS continuation passing function and returns an equivalent\n * version that returns a promise.\n * @example\n * Q.nfbind(FS.readFile, __filename)(\"utf-8\")\n * .then(console.log)\n * .done()\n */\nQ.nfbind =\nQ.denodeify = function (callback /*...args*/) {\n    var baseArgs = array_slice(arguments, 1);\n    return function () {\n        var nodeArgs = baseArgs.concat(array_slice(arguments));\n        var deferred = defer();\n        nodeArgs.push(deferred.makeNodeResolver());\n        Q(callback).fapply(nodeArgs).fail(deferred.reject);\n        return deferred.promise;\n    };\n};\n\nPromise.prototype.nfbind =\nPromise.prototype.denodeify = function (/*...args*/) {\n    var args = array_slice(arguments);\n    args.unshift(this);\n    return Q.denodeify.apply(void 0, args);\n};\n\nQ.nbind = function (callback, thisp /*...args*/) {\n    var baseArgs = array_slice(arguments, 2);\n    return function () {\n        var nodeArgs = baseArgs.concat(array_slice(arguments));\n        var deferred = defer();\n        nodeArgs.push(deferred.makeNodeResolver());\n        function bound() {\n            return callback.apply(thisp, arguments);\n        }\n        Q(bound).fapply(nodeArgs).fail(deferred.reject);\n        return deferred.promise;\n    };\n};\n\nPromise.prototype.nbind = function (/*thisp, ...args*/) {\n    var args = array_slice(arguments, 0);\n    args.unshift(this);\n    return Q.nbind.apply(void 0, args);\n};\n\n/**\n * Calls a method of a Node-style object that accepts a Node-style\n * callback with a given array of arguments, plus a provided callback.\n * @param object an object that has the named method\n * @param {String} name name of the method of object\n * @param {Array} args arguments to pass to the method; the callback\n * will be provided by Q and appended to these arguments.\n * @returns a promise for the value or error\n */\nQ.nmapply = // XXX As proposed by \"Redsandro\"\nQ.npost = function (object, name, args) {\n    return Q(object).npost(name, args);\n};\n\nPromise.prototype.nmapply = // XXX As proposed by \"Redsandro\"\nPromise.prototype.npost = function (name, args) {\n    var nodeArgs = array_slice(args || []);\n    var deferred = defer();\n    nodeArgs.push(deferred.makeNodeResolver());\n    this.dispatch(\"post\", [name, nodeArgs]).fail(deferred.reject);\n    return deferred.promise;\n};\n\n/**\n * Calls a method of a Node-style object that accepts a Node-style\n * callback, forwarding the given variadic arguments, plus a provided\n * callback argument.\n * @param object an object that has the named method\n * @param {String} name name of the method of object\n * @param ...args arguments to pass to the method; the callback will\n * be provided by Q and appended to these arguments.\n * @returns a promise for the value or error\n */\nQ.nsend = // XXX Based on Mark Miller's proposed \"send\"\nQ.nmcall = // XXX Based on \"Redsandro's\" proposal\nQ.ninvoke = function (object, name /*...args*/) {\n    var nodeArgs = array_slice(arguments, 2);\n    var deferred = defer();\n    nodeArgs.push(deferred.makeNodeResolver());\n    Q(object).dispatch(\"post\", [name, nodeArgs]).fail(deferred.reject);\n    return deferred.promise;\n};\n\nPromise.prototype.nsend = // XXX Based on Mark Miller's proposed \"send\"\nPromise.prototype.nmcall = // XXX Based on \"Redsandro's\" proposal\nPromise.prototype.ninvoke = function (name /*...args*/) {\n    var nodeArgs = array_slice(arguments, 1);\n    var deferred = defer();\n    nodeArgs.push(deferred.makeNodeResolver());\n    this.dispatch(\"post\", [name, nodeArgs]).fail(deferred.reject);\n    return deferred.promise;\n};\n\n/**\n * If a function would like to support both Node continuation-passing-style and\n * promise-returning-style, it can end its internal promise chain with\n * `nodeify(nodeback)`, forwarding the optional nodeback argument.  If the user\n * elects to use a nodeback, the result will be sent there.  If they do not\n * pass a nodeback, they will receive the result promise.\n * @param object a result (or a promise for a result)\n * @param {Function} nodeback a Node.js-style callback\n * @returns either the promise or nothing\n */\nQ.nodeify = nodeify;\nfunction nodeify(object, nodeback) {\n    return Q(object).nodeify(nodeback);\n}\n\nPromise.prototype.nodeify = function (nodeback) {\n    if (nodeback) {\n        this.then(function (value) {\n            nextTick(function () {\n                nodeback(null, value);\n            });\n        }, function (error) {\n            nextTick(function () {\n                nodeback(error);\n            });\n        });\n    } else {\n        return this;\n    }\n};\n\n// All code before this point will be filtered from stack traces.\nvar qEndingLine = captureLine();\n\nreturn Q;\n\n});\n\n//@ sourceURL=http://app/node_modules/q/q.js\n", arguments, window, require, module, exports);
(function () {// vim:ts=4:sts=4:sw=4:
/*!
 *
 * Copyright 2009-2012 Kris Kowal under the terms of the MIT
 * license found at http://github.com/kriskowal/q/raw/master/LICENSE
 *
 * With parts by Tyler Close
 * Copyright 2007-2009 Tyler Close under the terms of the MIT X license found
 * at http://www.opensource.org/licenses/mit-license.html
 * Forked at ref_send.js version: 2009-05-11
 *
 * With parts by Mark Miller
 * Copyright (C) 2011 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

(function (definition) {
    // Turn off strict mode for this function so we can assign to global.Q
    /* jshint strict: false */

    // This file will function properly as a <script> tag, or a module
    // using CommonJS and NodeJS or RequireJS module formats.  In
    // Common/Node/RequireJS, the module exports the Q API and when
    // executed as a simple <script>, it creates a Q global instead.

    // Montage Require
    if (typeof bootstrap === "function") {
        bootstrap("promise", definition);

    // CommonJS
    } else if (typeof exports === "object") {
        module.exports = definition();

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
        define(definition);

    // SES (Secure EcmaScript)
    } else if (typeof ses !== "undefined") {
        if (!ses.ok()) {
            return;
        } else {
            ses.makeQ = definition;
        }

    // <script>
    } else {
        Q = definition();
    }

})(function () {
"use strict";

var hasStacks = false;
try {
    throw new Error();
} catch (e) {
    hasStacks = !!e.stack;
}

// All code after this point will be filtered from stack traces reported
// by Q.
var qStartingLine = captureLine();
var qFileName;

// shims

// used for fallback in "allResolved"
var noop = function () {};

// Use the fastest possible means to execute a task in a future turn
// of the event loop.
var nextTick =(function () {
    // linked list of tasks (single, with head node)
    var head = {task: void 0, next: null};
    var tail = head;
    var flushing = false;
    var requestTick = void 0;
    var isNodeJS = false;

    function flush() {
        /* jshint loopfunc: true */

        while (head.next) {
            head = head.next;
            var task = head.task;
            head.task = void 0;
            var domain = head.domain;

            if (domain) {
                head.domain = void 0;
                domain.enter();
            }

            try {
                task();

            } catch (e) {
                if (isNodeJS) {
                    // In node, uncaught exceptions are considered fatal errors.
                    // Re-throw them synchronously to interrupt flushing!

                    // Ensure continuation if the uncaught exception is suppressed
                    // listening "uncaughtException" events (as domains does).
                    // Continue in next event to avoid tick recursion.
                    if (domain) {
                        domain.exit();
                    }
                    setTimeout(flush, 0);
                    if (domain) {
                        domain.enter();
                    }

                    throw e;

                } else {
                    // In browsers, uncaught exceptions are not fatal.
                    // Re-throw them asynchronously to avoid slow-downs.
                    setTimeout(function() {
                       throw e;
                    }, 0);
                }
            }

            if (domain) {
                domain.exit();
            }
        }

        flushing = false;
    }

    nextTick = function (task) {
        tail = tail.next = {
            task: task,
            domain: isNodeJS && process.domain,
            next: null
        };

        if (!flushing) {
            flushing = true;
            requestTick();
        }
    };

    if (typeof process !== "undefined" && process.nextTick) {
        // Node.js before 0.9. Note that some fake-Node environments, like the
        // Mocha test runner, introduce a `process` global without a `nextTick`.
        isNodeJS = true;

        requestTick = function () {
            process.nextTick(flush);
        };

    } else if (typeof setImmediate === "function") {
        // In IE10, Node.js 0.9+, or https://github.com/NobleJS/setImmediate
        if (typeof window !== "undefined") {
            requestTick = setImmediate.bind(window, flush);
        } else {
            requestTick = function () {
                setImmediate(flush);
            };
        }

    } else if (typeof MessageChannel !== "undefined") {
        // modern browsers
        // http://www.nonblocking.io/2011/06/windownexttick.html
        var channel = new MessageChannel();
        // At least Safari Version 6.0.5 (8536.30.1) intermittently cannot create
        // working message ports the first time a page loads.
        channel.port1.onmessage = function () {
            requestTick = requestPortTick;
            channel.port1.onmessage = flush;
            flush();
        };
        var requestPortTick = function () {
            // Opera requires us to provide a message payload, regardless of
            // whether we use it.
            channel.port2.postMessage(0);
        };
        requestTick = function () {
            setTimeout(flush, 0);
            requestPortTick();
        };

    } else {
        // old browsers
        requestTick = function () {
            setTimeout(flush, 0);
        };
    }

    return nextTick;
})();

// Attempt to make generics safe in the face of downstream
// modifications.
// There is no situation where this is necessary.
// If you need a security guarantee, these primordials need to be
// deeply frozen anyway, and if you don’t need a security guarantee,
// this is just plain paranoid.
// However, this **might** have the nice side-effect of reducing the size of
// the minified code by reducing x.call() to merely x()
// See Mark Miller’s explanation of what this does.
// http://wiki.ecmascript.org/doku.php?id=conventions:safe_meta_programming
var call = Function.call;
function uncurryThis(f) {
    return function () {
        return call.apply(f, arguments);
    };
}
// This is equivalent, but slower:
// uncurryThis = Function_bind.bind(Function_bind.call);
// http://jsperf.com/uncurrythis

var array_slice = uncurryThis(Array.prototype.slice);

var array_reduce = uncurryThis(
    Array.prototype.reduce || function (callback, basis) {
        var index = 0,
            length = this.length;
        // concerning the initial value, if one is not provided
        if (arguments.length === 1) {
            // seek to the first value in the array, accounting
            // for the possibility that is is a sparse array
            do {
                if (index in this) {
                    basis = this[index++];
                    break;
                }
                if (++index >= length) {
                    throw new TypeError();
                }
            } while (1);
        }
        // reduce
        for (; index < length; index++) {
            // account for the possibility that the array is sparse
            if (index in this) {
                basis = callback(basis, this[index], index);
            }
        }
        return basis;
    }
);

var array_indexOf = uncurryThis(
    Array.prototype.indexOf || function (value) {
        // not a very good shim, but good enough for our one use of it
        for (var i = 0; i < this.length; i++) {
            if (this[i] === value) {
                return i;
            }
        }
        return -1;
    }
);

var array_map = uncurryThis(
    Array.prototype.map || function (callback, thisp) {
        var self = this;
        var collect = [];
        array_reduce(self, function (undefined, value, index) {
            collect.push(callback.call(thisp, value, index, self));
        }, void 0);
        return collect;
    }
);

var object_create = Object.create || function (prototype) {
    function Type() { }
    Type.prototype = prototype;
    return new Type();
};

var object_hasOwnProperty = uncurryThis(Object.prototype.hasOwnProperty);

var object_keys = Object.keys || function (object) {
    var keys = [];
    for (var key in object) {
        if (object_hasOwnProperty(object, key)) {
            keys.push(key);
        }
    }
    return keys;
};

var object_toString = uncurryThis(Object.prototype.toString);

function isObject(value) {
    return value === Object(value);
}

// generator related shims

// FIXME: Remove this function once ES6 generators are in SpiderMonkey.
function isStopIteration(exception) {
    return (
        object_toString(exception) === "[object StopIteration]" ||
        exception instanceof QReturnValue
    );
}

// FIXME: Remove this helper and Q.return once ES6 generators are in
// SpiderMonkey.
var QReturnValue;
if (typeof ReturnValue !== "undefined") {
    QReturnValue = ReturnValue;
} else {
    QReturnValue = function (value) {
        this.value = value;
    };
}

// long stack traces

var STACK_JUMP_SEPARATOR = "From previous event:";

function makeStackTraceLong(error, promise) {
    // If possible, transform the error stack trace by removing Node and Q
    // cruft, then concatenating with the stack trace of `promise`. See #57.
    if (hasStacks &&
        promise.stack &&
        typeof error === "object" &&
        error !== null &&
        error.stack &&
        error.stack.indexOf(STACK_JUMP_SEPARATOR) === -1
    ) {
        var stacks = [];
        for (var p = promise; !!p; p = p.source) {
            if (p.stack) {
                stacks.unshift(p.stack);
            }
        }
        stacks.unshift(error.stack);

        var concatedStacks = stacks.join("\n" + STACK_JUMP_SEPARATOR + "\n");
        error.stack = filterStackString(concatedStacks);
    }
}

function filterStackString(stackString) {
    var lines = stackString.split("\n");
    var desiredLines = [];
    for (var i = 0; i < lines.length; ++i) {
        var line = lines[i];

        if (!isInternalFrame(line) && !isNodeFrame(line) && line) {
            desiredLines.push(line);
        }
    }
    return desiredLines.join("\n");
}

function isNodeFrame(stackLine) {
    return stackLine.indexOf("(module.js:") !== -1 ||
           stackLine.indexOf("(node.js:") !== -1;
}

function getFileNameAndLineNumber(stackLine) {
    // Named functions: "at functionName (filename:lineNumber:columnNumber)"
    // In IE10 function name can have spaces ("Anonymous function") O_o
    var attempt1 = /at .+ \((.+):(\d+):(?:\d+)\)$/.exec(stackLine);
    if (attempt1) {
        return [attempt1[1], Number(attempt1[2])];
    }

    // Anonymous functions: "at filename:lineNumber:columnNumber"
    var attempt2 = /at ([^ ]+):(\d+):(?:\d+)$/.exec(stackLine);
    if (attempt2) {
        return [attempt2[1], Number(attempt2[2])];
    }

    // Firefox style: "function@filename:lineNumber or @filename:lineNumber"
    var attempt3 = /.*@(.+):(\d+)$/.exec(stackLine);
    if (attempt3) {
        return [attempt3[1], Number(attempt3[2])];
    }
}

function isInternalFrame(stackLine) {
    var fileNameAndLineNumber = getFileNameAndLineNumber(stackLine);

    if (!fileNameAndLineNumber) {
        return false;
    }

    var fileName = fileNameAndLineNumber[0];
    var lineNumber = fileNameAndLineNumber[1];

    return fileName === qFileName &&
        lineNumber >= qStartingLine &&
        lineNumber <= qEndingLine;
}

// discover own file name and line number range for filtering stack
// traces
function captureLine() {
    if (!hasStacks) {
        return;
    }

    try {
        throw new Error();
    } catch (e) {
        var lines = e.stack.split("\n");
        var firstLine = lines[0].indexOf("@") > 0 ? lines[1] : lines[2];
        var fileNameAndLineNumber = getFileNameAndLineNumber(firstLine);
        if (!fileNameAndLineNumber) {
            return;
        }

        qFileName = fileNameAndLineNumber[0];
        return fileNameAndLineNumber[1];
    }
}

function deprecate(callback, name, alternative) {
    return function () {
        if (typeof console !== "undefined" &&
            typeof console.warn === "function") {
            console.warn(name + " is deprecated, use " + alternative +
                         " instead.", new Error("").stack);
        }
        return callback.apply(callback, arguments);
    };
}

// end of shims
// beginning of real work

/**
 * Constructs a promise for an immediate reference, passes promises through, or
 * coerces promises from different systems.
 * @param value immediate reference or promise
 */
function Q(value) {
    // If the object is already a Promise, return it directly.  This enables
    // the resolve function to both be used to created references from objects,
    // but to tolerably coerce non-promises to promises.
    if (isPromise(value)) {
        return value;
    }

    // assimilate thenables
    if (isPromiseAlike(value)) {
        return coerce(value);
    } else {
        return fulfill(value);
    }
}
Q.resolve = Q;

/**
 * Performs a task in a future turn of the event loop.
 * @param {Function} task
 */
Q.nextTick = nextTick;

/**
 * Controls whether or not long stack traces will be on
 */
Q.longStackSupport = false;

/**
 * Constructs a {promise, resolve, reject} object.
 *
 * `resolve` is a callback to invoke with a more resolved value for the
 * promise. To fulfill the promise, invoke `resolve` with any value that is
 * not a thenable. To reject the promise, invoke `resolve` with a rejected
 * thenable, or invoke `reject` with the reason directly. To resolve the
 * promise to another thenable, thus putting it in the same state, invoke
 * `resolve` with that other thenable.
 */
Q.defer = defer;
function defer() {
    // if "messages" is an "Array", that indicates that the promise has not yet
    // been resolved.  If it is "undefined", it has been resolved.  Each
    // element of the messages array is itself an array of complete arguments to
    // forward to the resolved promise.  We coerce the resolution value to a
    // promise using the `resolve` function because it handles both fully
    // non-thenable values and other thenables gracefully.
    var messages = [], progressListeners = [], resolvedPromise;

    var deferred = object_create(defer.prototype);
    var promise = object_create(Promise.prototype);

    promise.promiseDispatch = function (resolve, op, operands) {
        var args = array_slice(arguments);
        if (messages) {
            messages.push(args);
            if (op === "when" && operands[1]) { // progress operand
                progressListeners.push(operands[1]);
            }
        } else {
            nextTick(function () {
                resolvedPromise.promiseDispatch.apply(resolvedPromise, args);
            });
        }
    };

    // XXX deprecated
    promise.valueOf = function () {
        if (messages) {
            return promise;
        }
        var nearerValue = nearer(resolvedPromise);
        if (isPromise(nearerValue)) {
            resolvedPromise = nearerValue; // shorten chain
        }
        return nearerValue;
    };

    promise.inspect = function () {
        if (!resolvedPromise) {
            return { state: "pending" };
        }
        return resolvedPromise.inspect();
    };

    if (Q.longStackSupport && hasStacks) {
        try {
            throw new Error();
        } catch (e) {
            // NOTE: don't try to use `Error.captureStackTrace` or transfer the
            // accessor around; that causes memory leaks as per GH-111. Just
            // reify the stack trace as a string ASAP.
            //
            // At the same time, cut off the first line; it's always just
            // "[object Promise]\n", as per the `toString`.
            promise.stack = e.stack.substring(e.stack.indexOf("\n") + 1);
        }
    }

    // NOTE: we do the checks for `resolvedPromise` in each method, instead of
    // consolidating them into `become`, since otherwise we'd create new
    // promises with the lines `become(whatever(value))`. See e.g. GH-252.

    function become(newPromise) {
        resolvedPromise = newPromise;
        promise.source = newPromise;

        array_reduce(messages, function (undefined, message) {
            nextTick(function () {
                newPromise.promiseDispatch.apply(newPromise, message);
            });
        }, void 0);

        messages = void 0;
        progressListeners = void 0;
    }

    deferred.promise = promise;
    deferred.resolve = function (value) {
        if (resolvedPromise) {
            return;
        }

        become(Q(value));
    };

    deferred.fulfill = function (value) {
        if (resolvedPromise) {
            return;
        }

        become(fulfill(value));
    };
    deferred.reject = function (reason) {
        if (resolvedPromise) {
            return;
        }

        become(reject(reason));
    };
    deferred.notify = function (progress) {
        if (resolvedPromise) {
            return;
        }

        array_reduce(progressListeners, function (undefined, progressListener) {
            nextTick(function () {
                progressListener(progress);
            });
        }, void 0);
    };

    return deferred;
}

/**
 * Creates a Node-style callback that will resolve or reject the deferred
 * promise.
 * @returns a nodeback
 */
defer.prototype.makeNodeResolver = function () {
    var self = this;
    return function (error, value) {
        if (error) {
            self.reject(error);
        } else if (arguments.length > 2) {
            self.resolve(array_slice(arguments, 1));
        } else {
            self.resolve(value);
        }
    };
};

/**
 * @param resolver {Function} a function that returns nothing and accepts
 * the resolve, reject, and notify functions for a deferred.
 * @returns a promise that may be resolved with the given resolve and reject
 * functions, or rejected by a thrown exception in resolver
 */
Q.Promise = promise; // ES6
Q.promise = promise;
function promise(resolver) {
    if (typeof resolver !== "function") {
        throw new TypeError("resolver must be a function.");
    }
    var deferred = defer();
    try {
        resolver(deferred.resolve, deferred.reject, deferred.notify);
    } catch (reason) {
        deferred.reject(reason);
    }
    return deferred.promise;
}

promise.race = race; // ES6
promise.all = all; // ES6
promise.reject = reject; // ES6
promise.resolve = Q; // ES6

// XXX experimental.  This method is a way to denote that a local value is
// serializable and should be immediately dispatched to a remote upon request,
// instead of passing a reference.
Q.passByCopy = function (object) {
    //freeze(object);
    //passByCopies.set(object, true);
    return object;
};

Promise.prototype.passByCopy = function () {
    //freeze(object);
    //passByCopies.set(object, true);
    return this;
};

/**
 * If two promises eventually fulfill to the same value, promises that value,
 * but otherwise rejects.
 * @param x {Any*}
 * @param y {Any*}
 * @returns {Any*} a promise for x and y if they are the same, but a rejection
 * otherwise.
 *
 */
Q.join = function (x, y) {
    return Q(x).join(y);
};

Promise.prototype.join = function (that) {
    return Q([this, that]).spread(function (x, y) {
        if (x === y) {
            // TODO: "===" should be Object.is or equiv
            return x;
        } else {
            throw new Error("Can't join: not the same: " + x + " " + y);
        }
    });
};

/**
 * Returns a promise for the first of an array of promises to become fulfilled.
 * @param answers {Array[Any*]} promises to race
 * @returns {Any*} the first promise to be fulfilled
 */
Q.race = race;
function race(answerPs) {
    return promise(function(resolve, reject) {
        // Switch to this once we can assume at least ES5
        // answerPs.forEach(function(answerP) {
        //     Q(answerP).then(resolve, reject);
        // });
        // Use this in the meantime
        for (var i = 0, len = answerPs.length; i < len; i++) {
            Q(answerPs[i]).then(resolve, reject);
        }
    });
}

Promise.prototype.race = function () {
    return this.then(Q.race);
};

/**
 * Constructs a Promise with a promise descriptor object and optional fallback
 * function.  The descriptor contains methods like when(rejected), get(name),
 * set(name, value), post(name, args), and delete(name), which all
 * return either a value, a promise for a value, or a rejection.  The fallback
 * accepts the operation name, a resolver, and any further arguments that would
 * have been forwarded to the appropriate method above had a method been
 * provided with the proper name.  The API makes no guarantees about the nature
 * of the returned object, apart from that it is usable whereever promises are
 * bought and sold.
 */
Q.makePromise = Promise;
function Promise(descriptor, fallback, inspect) {
    if (fallback === void 0) {
        fallback = function (op) {
            return reject(new Error(
                "Promise does not support operation: " + op
            ));
        };
    }
    if (inspect === void 0) {
        inspect = function () {
            return {state: "unknown"};
        };
    }

    var promise = object_create(Promise.prototype);

    promise.promiseDispatch = function (resolve, op, args) {
        var result;
        try {
            if (descriptor[op]) {
                result = descriptor[op].apply(promise, args);
            } else {
                result = fallback.call(promise, op, args);
            }
        } catch (exception) {
            result = reject(exception);
        }
        if (resolve) {
            resolve(result);
        }
    };

    promise.inspect = inspect;

    // XXX deprecated `valueOf` and `exception` support
    if (inspect) {
        var inspected = inspect();
        if (inspected.state === "rejected") {
            promise.exception = inspected.reason;
        }

        promise.valueOf = function () {
            var inspected = inspect();
            if (inspected.state === "pending" ||
                inspected.state === "rejected") {
                return promise;
            }
            return inspected.value;
        };
    }

    return promise;
}

Promise.prototype.toString = function () {
    return "[object Promise]";
};

Promise.prototype.then = function (fulfilled, rejected, progressed) {
    var self = this;
    var deferred = defer();
    var done = false;   // ensure the untrusted promise makes at most a
                        // single call to one of the callbacks

    function _fulfilled(value) {
        try {
            return typeof fulfilled === "function" ? fulfilled(value) : value;
        } catch (exception) {
            return reject(exception);
        }
    }

    function _rejected(exception) {
        if (typeof rejected === "function") {
            makeStackTraceLong(exception, self);
            try {
                return rejected(exception);
            } catch (newException) {
                return reject(newException);
            }
        }
        return reject(exception);
    }

    function _progressed(value) {
        return typeof progressed === "function" ? progressed(value) : value;
    }

    nextTick(function () {
        self.promiseDispatch(function (value) {
            if (done) {
                return;
            }
            done = true;

            deferred.resolve(_fulfilled(value));
        }, "when", [function (exception) {
            if (done) {
                return;
            }
            done = true;

            deferred.resolve(_rejected(exception));
        }]);
    });

    // Progress propagator need to be attached in the current tick.
    self.promiseDispatch(void 0, "when", [void 0, function (value) {
        var newValue;
        var threw = false;
        try {
            newValue = _progressed(value);
        } catch (e) {
            threw = true;
            if (Q.onerror) {
                Q.onerror(e);
            } else {
                throw e;
            }
        }

        if (!threw) {
            deferred.notify(newValue);
        }
    }]);

    return deferred.promise;
};

/**
 * Registers an observer on a promise.
 *
 * Guarantees:
 *
 * 1. that fulfilled and rejected will be called only once.
 * 2. that either the fulfilled callback or the rejected callback will be
 *    called, but not both.
 * 3. that fulfilled and rejected will not be called in this turn.
 *
 * @param value      promise or immediate reference to observe
 * @param fulfilled  function to be called with the fulfilled value
 * @param rejected   function to be called with the rejection exception
 * @param progressed function to be called on any progress notifications
 * @return promise for the return value from the invoked callback
 */
Q.when = when;
function when(value, fulfilled, rejected, progressed) {
    return Q(value).then(fulfilled, rejected, progressed);
}

Promise.prototype.thenResolve = function (value) {
    return this.then(function () { return value; });
};

Q.thenResolve = function (promise, value) {
    return Q(promise).thenResolve(value);
};

Promise.prototype.thenReject = function (reason) {
    return this.then(function () { throw reason; });
};

Q.thenReject = function (promise, reason) {
    return Q(promise).thenReject(reason);
};

/**
 * If an object is not a promise, it is as "near" as possible.
 * If a promise is rejected, it is as "near" as possible too.
 * If it’s a fulfilled promise, the fulfillment value is nearer.
 * If it’s a deferred promise and the deferred has been resolved, the
 * resolution is "nearer".
 * @param object
 * @returns most resolved (nearest) form of the object
 */

// XXX should we re-do this?
Q.nearer = nearer;
function nearer(value) {
    if (isPromise(value)) {
        var inspected = value.inspect();
        if (inspected.state === "fulfilled") {
            return inspected.value;
        }
    }
    return value;
}

/**
 * @returns whether the given object is a promise.
 * Otherwise it is a fulfilled value.
 */
Q.isPromise = isPromise;
function isPromise(object) {
    return isObject(object) &&
        typeof object.promiseDispatch === "function" &&
        typeof object.inspect === "function";
}

Q.isPromiseAlike = isPromiseAlike;
function isPromiseAlike(object) {
    return isObject(object) && typeof object.then === "function";
}

/**
 * @returns whether the given object is a pending promise, meaning not
 * fulfilled or rejected.
 */
Q.isPending = isPending;
function isPending(object) {
    return isPromise(object) && object.inspect().state === "pending";
}

Promise.prototype.isPending = function () {
    return this.inspect().state === "pending";
};

/**
 * @returns whether the given object is a value or fulfilled
 * promise.
 */
Q.isFulfilled = isFulfilled;
function isFulfilled(object) {
    return !isPromise(object) || object.inspect().state === "fulfilled";
}

Promise.prototype.isFulfilled = function () {
    return this.inspect().state === "fulfilled";
};

/**
 * @returns whether the given object is a rejected promise.
 */
Q.isRejected = isRejected;
function isRejected(object) {
    return isPromise(object) && object.inspect().state === "rejected";
}

Promise.prototype.isRejected = function () {
    return this.inspect().state === "rejected";
};

//// BEGIN UNHANDLED REJECTION TRACKING

// This promise library consumes exceptions thrown in handlers so they can be
// handled by a subsequent promise.  The exceptions get added to this array when
// they are created, and removed when they are handled.  Note that in ES6 or
// shimmed environments, this would naturally be a `Set`.
var unhandledReasons = [];
var unhandledRejections = [];
var trackUnhandledRejections = true;

function resetUnhandledRejections() {
    unhandledReasons.length = 0;
    unhandledRejections.length = 0;

    if (!trackUnhandledRejections) {
        trackUnhandledRejections = true;
    }
}

function trackRejection(promise, reason) {
    if (!trackUnhandledRejections) {
        return;
    }

    unhandledRejections.push(promise);
    if (reason && typeof reason.stack !== "undefined") {
        unhandledReasons.push(reason.stack);
    } else {
        unhandledReasons.push("(no stack) " + reason);
    }
}

function untrackRejection(promise) {
    if (!trackUnhandledRejections) {
        return;
    }

    var at = array_indexOf(unhandledRejections, promise);
    if (at !== -1) {
        unhandledRejections.splice(at, 1);
        unhandledReasons.splice(at, 1);
    }
}

Q.resetUnhandledRejections = resetUnhandledRejections;

Q.getUnhandledReasons = function () {
    // Make a copy so that consumers can't interfere with our internal state.
    return unhandledReasons.slice();
};

Q.stopUnhandledRejectionTracking = function () {
    resetUnhandledRejections();
    trackUnhandledRejections = false;
};

resetUnhandledRejections();

//// END UNHANDLED REJECTION TRACKING

/**
 * Constructs a rejected promise.
 * @param reason value describing the failure
 */
Q.reject = reject;
function reject(reason) {
    var rejection = Promise({
        "when": function (rejected) {
            // note that the error has been handled
            if (rejected) {
                untrackRejection(this);
            }
            return rejected ? rejected(reason) : this;
        }
    }, function fallback() {
        return this;
    }, function inspect() {
        return { state: "rejected", reason: reason };
    });

    // Note that the reason has not been handled.
    trackRejection(rejection, reason);

    return rejection;
}

/**
 * Constructs a fulfilled promise for an immediate reference.
 * @param value immediate reference
 */
Q.fulfill = fulfill;
function fulfill(value) {
    return Promise({
        "when": function () {
            return value;
        },
        "get": function (name) {
            return value[name];
        },
        "set": function (name, rhs) {
            value[name] = rhs;
        },
        "delete": function (name) {
            delete value[name];
        },
        "post": function (name, args) {
            // Mark Miller proposes that post with no name should apply a
            // promised function.
            if (name === null || name === void 0) {
                return value.apply(void 0, args);
            } else {
                return value[name].apply(value, args);
            }
        },
        "apply": function (thisp, args) {
            return value.apply(thisp, args);
        },
        "keys": function () {
            return object_keys(value);
        }
    }, void 0, function inspect() {
        return { state: "fulfilled", value: value };
    });
}

/**
 * Converts thenables to Q promises.
 * @param promise thenable promise
 * @returns a Q promise
 */
function coerce(promise) {
    var deferred = defer();
    nextTick(function () {
        try {
            promise.then(deferred.resolve, deferred.reject, deferred.notify);
        } catch (exception) {
            deferred.reject(exception);
        }
    });
    return deferred.promise;
}

/**
 * Annotates an object such that it will never be
 * transferred away from this process over any promise
 * communication channel.
 * @param object
 * @returns promise a wrapping of that object that
 * additionally responds to the "isDef" message
 * without a rejection.
 */
Q.master = master;
function master(object) {
    return Promise({
        "isDef": function () {}
    }, function fallback(op, args) {
        return dispatch(object, op, args);
    }, function () {
        return Q(object).inspect();
    });
}

/**
 * Spreads the values of a promised array of arguments into the
 * fulfillment callback.
 * @param fulfilled callback that receives variadic arguments from the
 * promised array
 * @param rejected callback that receives the exception if the promise
 * is rejected.
 * @returns a promise for the return value or thrown exception of
 * either callback.
 */
Q.spread = spread;
function spread(value, fulfilled, rejected) {
    return Q(value).spread(fulfilled, rejected);
}

Promise.prototype.spread = function (fulfilled, rejected) {
    return this.all().then(function (array) {
        return fulfilled.apply(void 0, array);
    }, rejected);
};

/**
 * The async function is a decorator for generator functions, turning
 * them into asynchronous generators.  Although generators are only part
 * of the newest ECMAScript 6 drafts, this code does not cause syntax
 * errors in older engines.  This code should continue to work and will
 * in fact improve over time as the language improves.
 *
 * ES6 generators are currently part of V8 version 3.19 with the
 * --harmony-generators runtime flag enabled.  SpiderMonkey has had them
 * for longer, but under an older Python-inspired form.  This function
 * works on both kinds of generators.
 *
 * Decorates a generator function such that:
 *  - it may yield promises
 *  - execution will continue when that promise is fulfilled
 *  - the value of the yield expression will be the fulfilled value
 *  - it returns a promise for the return value (when the generator
 *    stops iterating)
 *  - the decorated function returns a promise for the return value
 *    of the generator or the first rejected promise among those
 *    yielded.
 *  - if an error is thrown in the generator, it propagates through
 *    every following yield until it is caught, or until it escapes
 *    the generator function altogether, and is translated into a
 *    rejection for the promise returned by the decorated generator.
 */
Q.async = async;
function async(makeGenerator) {
    return function () {
        // when verb is "send", arg is a value
        // when verb is "throw", arg is an exception
        function continuer(verb, arg) {
            var result;

            // Until V8 3.19 / Chromium 29 is released, SpiderMonkey is the only
            // engine that has a deployed base of browsers that support generators.
            // However, SM's generators use the Python-inspired semantics of
            // outdated ES6 drafts.  We would like to support ES6, but we'd also
            // like to make it possible to use generators in deployed browsers, so
            // we also support Python-style generators.  At some point we can remove
            // this block.

            if (typeof StopIteration === "undefined") {
                // ES6 Generators
                try {
                    result = generator[verb](arg);
                } catch (exception) {
                    return reject(exception);
                }
                if (result.done) {
                    return result.value;
                } else {
                    return when(result.value, callback, errback);
                }
            } else {
                // SpiderMonkey Generators
                // FIXME: Remove this case when SM does ES6 generators.
                try {
                    result = generator[verb](arg);
                } catch (exception) {
                    if (isStopIteration(exception)) {
                        return exception.value;
                    } else {
                        return reject(exception);
                    }
                }
                return when(result, callback, errback);
            }
        }
        var generator = makeGenerator.apply(this, arguments);
        var callback = continuer.bind(continuer, "next");
        var errback = continuer.bind(continuer, "throw");
        return callback();
    };
}

/**
 * The spawn function is a small wrapper around async that immediately
 * calls the generator and also ends the promise chain, so that any
 * unhandled errors are thrown instead of forwarded to the error
 * handler. This is useful because it's extremely common to run
 * generators at the top-level to work with libraries.
 */
Q.spawn = spawn;
function spawn(makeGenerator) {
    Q.done(Q.async(makeGenerator)());
}

// FIXME: Remove this interface once ES6 generators are in SpiderMonkey.
/**
 * Throws a ReturnValue exception to stop an asynchronous generator.
 *
 * This interface is a stop-gap measure to support generator return
 * values in older Firefox/SpiderMonkey.  In browsers that support ES6
 * generators like Chromium 29, just use "return" in your generator
 * functions.
 *
 * @param value the return value for the surrounding generator
 * @throws ReturnValue exception with the value.
 * @example
 * // ES6 style
 * Q.async(function* () {
 *      var foo = yield getFooPromise();
 *      var bar = yield getBarPromise();
 *      return foo + bar;
 * })
 * // Older SpiderMonkey style
 * Q.async(function () {
 *      var foo = yield getFooPromise();
 *      var bar = yield getBarPromise();
 *      Q.return(foo + bar);
 * })
 */
Q["return"] = _return;
function _return(value) {
    throw new QReturnValue(value);
}

/**
 * The promised function decorator ensures that any promise arguments
 * are settled and passed as values (`this` is also settled and passed
 * as a value).  It will also ensure that the result of a function is
 * always a promise.
 *
 * @example
 * var add = Q.promised(function (a, b) {
 *     return a + b;
 * });
 * add(Q(a), Q(B));
 *
 * @param {function} callback The function to decorate
 * @returns {function} a function that has been decorated.
 */
Q.promised = promised;
function promised(callback) {
    return function () {
        return spread([this, all(arguments)], function (self, args) {
            return callback.apply(self, args);
        });
    };
}

/**
 * sends a message to a value in a future turn
 * @param object* the recipient
 * @param op the name of the message operation, e.g., "when",
 * @param args further arguments to be forwarded to the operation
 * @returns result {Promise} a promise for the result of the operation
 */
Q.dispatch = dispatch;
function dispatch(object, op, args) {
    return Q(object).dispatch(op, args);
}

Promise.prototype.dispatch = function (op, args) {
    var self = this;
    var deferred = defer();
    nextTick(function () {
        self.promiseDispatch(deferred.resolve, op, args);
    });
    return deferred.promise;
};

/**
 * Gets the value of a property in a future turn.
 * @param object    promise or immediate reference for target object
 * @param name      name of property to get
 * @return promise for the property value
 */
Q.get = function (object, key) {
    return Q(object).dispatch("get", [key]);
};

Promise.prototype.get = function (key) {
    return this.dispatch("get", [key]);
};

/**
 * Sets the value of a property in a future turn.
 * @param object    promise or immediate reference for object object
 * @param name      name of property to set
 * @param value     new value of property
 * @return promise for the return value
 */
Q.set = function (object, key, value) {
    return Q(object).dispatch("set", [key, value]);
};

Promise.prototype.set = function (key, value) {
    return this.dispatch("set", [key, value]);
};

/**
 * Deletes a property in a future turn.
 * @param object    promise or immediate reference for target object
 * @param name      name of property to delete
 * @return promise for the return value
 */
Q.del = // XXX legacy
Q["delete"] = function (object, key) {
    return Q(object).dispatch("delete", [key]);
};

Promise.prototype.del = // XXX legacy
Promise.prototype["delete"] = function (key) {
    return this.dispatch("delete", [key]);
};

/**
 * Invokes a method in a future turn.
 * @param object    promise or immediate reference for target object
 * @param name      name of method to invoke
 * @param value     a value to post, typically an array of
 *                  invocation arguments for promises that
 *                  are ultimately backed with `resolve` values,
 *                  as opposed to those backed with URLs
 *                  wherein the posted value can be any
 *                  JSON serializable object.
 * @return promise for the return value
 */
// bound locally because it is used by other methods
Q.mapply = // XXX As proposed by "Redsandro"
Q.post = function (object, name, args) {
    return Q(object).dispatch("post", [name, args]);
};

Promise.prototype.mapply = // XXX As proposed by "Redsandro"
Promise.prototype.post = function (name, args) {
    return this.dispatch("post", [name, args]);
};

/**
 * Invokes a method in a future turn.
 * @param object    promise or immediate reference for target object
 * @param name      name of method to invoke
 * @param ...args   array of invocation arguments
 * @return promise for the return value
 */
Q.send = // XXX Mark Miller's proposed parlance
Q.mcall = // XXX As proposed by "Redsandro"
Q.invoke = function (object, name /*...args*/) {
    return Q(object).dispatch("post", [name, array_slice(arguments, 2)]);
};

Promise.prototype.send = // XXX Mark Miller's proposed parlance
Promise.prototype.mcall = // XXX As proposed by "Redsandro"
Promise.prototype.invoke = function (name /*...args*/) {
    return this.dispatch("post", [name, array_slice(arguments, 1)]);
};

/**
 * Applies the promised function in a future turn.
 * @param object    promise or immediate reference for target function
 * @param args      array of application arguments
 */
Q.fapply = function (object, args) {
    return Q(object).dispatch("apply", [void 0, args]);
};

Promise.prototype.fapply = function (args) {
    return this.dispatch("apply", [void 0, args]);
};

/**
 * Calls the promised function in a future turn.
 * @param object    promise or immediate reference for target function
 * @param ...args   array of application arguments
 */
Q["try"] =
Q.fcall = function (object /* ...args*/) {
    return Q(object).dispatch("apply", [void 0, array_slice(arguments, 1)]);
};

Promise.prototype.fcall = function (/*...args*/) {
    return this.dispatch("apply", [void 0, array_slice(arguments)]);
};

/**
 * Binds the promised function, transforming return values into a fulfilled
 * promise and thrown errors into a rejected one.
 * @param object    promise or immediate reference for target function
 * @param ...args   array of application arguments
 */
Q.fbind = function (object /*...args*/) {
    var promise = Q(object);
    var args = array_slice(arguments, 1);
    return function fbound() {
        return promise.dispatch("apply", [
            this,
            args.concat(array_slice(arguments))
        ]);
    };
};
Promise.prototype.fbind = function (/*...args*/) {
    var promise = this;
    var args = array_slice(arguments);
    return function fbound() {
        return promise.dispatch("apply", [
            this,
            args.concat(array_slice(arguments))
        ]);
    };
};

/**
 * Requests the names of the owned properties of a promised
 * object in a future turn.
 * @param object    promise or immediate reference for target object
 * @return promise for the keys of the eventually settled object
 */
Q.keys = function (object) {
    return Q(object).dispatch("keys", []);
};

Promise.prototype.keys = function () {
    return this.dispatch("keys", []);
};

/**
 * Turns an array of promises into a promise for an array.  If any of
 * the promises gets rejected, the whole array is rejected immediately.
 * @param {Array*} an array (or promise for an array) of values (or
 * promises for values)
 * @returns a promise for an array of the corresponding values
 */
// By Mark Miller
// http://wiki.ecmascript.org/doku.php?id=strawman:concurrency&rev=1308776521#allfulfilled
Q.all = all;
function all(promises) {
    return when(promises, function (promises) {
        var countDown = 0;
        var deferred = defer();
        array_reduce(promises, function (undefined, promise, index) {
            var snapshot;
            if (
                isPromise(promise) &&
                (snapshot = promise.inspect()).state === "fulfilled"
            ) {
                promises[index] = snapshot.value;
            } else {
                ++countDown;
                when(
                    promise,
                    function (value) {
                        promises[index] = value;
                        if (--countDown === 0) {
                            deferred.resolve(promises);
                        }
                    },
                    deferred.reject,
                    function (progress) {
                        deferred.notify({ index: index, value: progress });
                    }
                );
            }
        }, void 0);
        if (countDown === 0) {
            deferred.resolve(promises);
        }
        return deferred.promise;
    });
}

Promise.prototype.all = function () {
    return all(this);
};

/**
 * Waits for all promises to be settled, either fulfilled or
 * rejected.  This is distinct from `all` since that would stop
 * waiting at the first rejection.  The promise returned by
 * `allResolved` will never be rejected.
 * @param promises a promise for an array (or an array) of promises
 * (or values)
 * @return a promise for an array of promises
 */
Q.allResolved = deprecate(allResolved, "allResolved", "allSettled");
function allResolved(promises) {
    return when(promises, function (promises) {
        promises = array_map(promises, Q);
        return when(all(array_map(promises, function (promise) {
            return when(promise, noop, noop);
        })), function () {
            return promises;
        });
    });
}

Promise.prototype.allResolved = function () {
    return allResolved(this);
};

/**
 * @see Promise#allSettled
 */
Q.allSettled = allSettled;
function allSettled(promises) {
    return Q(promises).allSettled();
}

/**
 * Turns an array of promises into a promise for an array of their states (as
 * returned by `inspect`) when they have all settled.
 * @param {Array[Any*]} values an array (or promise for an array) of values (or
 * promises for values)
 * @returns {Array[State]} an array of states for the respective values.
 */
Promise.prototype.allSettled = function () {
    return this.then(function (promises) {
        return all(array_map(promises, function (promise) {
            promise = Q(promise);
            function regardless() {
                return promise.inspect();
            }
            return promise.then(regardless, regardless);
        }));
    });
};

/**
 * Captures the failure of a promise, giving an oportunity to recover
 * with a callback.  If the given promise is fulfilled, the returned
 * promise is fulfilled.
 * @param {Any*} promise for something
 * @param {Function} callback to fulfill the returned promise if the
 * given promise is rejected
 * @returns a promise for the return value of the callback
 */
Q.fail = // XXX legacy
Q["catch"] = function (object, rejected) {
    return Q(object).then(void 0, rejected);
};

Promise.prototype.fail = // XXX legacy
Promise.prototype["catch"] = function (rejected) {
    return this.then(void 0, rejected);
};

/**
 * Attaches a listener that can respond to progress notifications from a
 * promise's originating deferred. This listener receives the exact arguments
 * passed to ``deferred.notify``.
 * @param {Any*} promise for something
 * @param {Function} callback to receive any progress notifications
 * @returns the given promise, unchanged
 */
Q.progress = progress;
function progress(object, progressed) {
    return Q(object).then(void 0, void 0, progressed);
}

Promise.prototype.progress = function (progressed) {
    return this.then(void 0, void 0, progressed);
};

/**
 * Provides an opportunity to observe the settling of a promise,
 * regardless of whether the promise is fulfilled or rejected.  Forwards
 * the resolution to the returned promise when the callback is done.
 * The callback can return a promise to defer completion.
 * @param {Any*} promise
 * @param {Function} callback to observe the resolution of the given
 * promise, takes no arguments.
 * @returns a promise for the resolution of the given promise when
 * ``fin`` is done.
 */
Q.fin = // XXX legacy
Q["finally"] = function (object, callback) {
    return Q(object)["finally"](callback);
};

Promise.prototype.fin = // XXX legacy
Promise.prototype["finally"] = function (callback) {
    callback = Q(callback);
    return this.then(function (value) {
        return callback.fcall().then(function () {
            return value;
        });
    }, function (reason) {
        // TODO attempt to recycle the rejection with "this".
        return callback.fcall().then(function () {
            throw reason;
        });
    });
};

/**
 * Terminates a chain of promises, forcing rejections to be
 * thrown as exceptions.
 * @param {Any*} promise at the end of a chain of promises
 * @returns nothing
 */
Q.done = function (object, fulfilled, rejected, progress) {
    return Q(object).done(fulfilled, rejected, progress);
};

Promise.prototype.done = function (fulfilled, rejected, progress) {
    var onUnhandledError = function (error) {
        // forward to a future turn so that ``when``
        // does not catch it and turn it into a rejection.
        nextTick(function () {
            makeStackTraceLong(error, promise);
            if (Q.onerror) {
                Q.onerror(error);
            } else {
                throw error;
            }
        });
    };

    // Avoid unnecessary `nextTick`ing via an unnecessary `when`.
    var promise = fulfilled || rejected || progress ?
        this.then(fulfilled, rejected, progress) :
        this;

    if (typeof process === "object" && process && process.domain) {
        onUnhandledError = process.domain.bind(onUnhandledError);
    }

    promise.then(void 0, onUnhandledError);
};

/**
 * Causes a promise to be rejected if it does not get fulfilled before
 * some milliseconds time out.
 * @param {Any*} promise
 * @param {Number} milliseconds timeout
 * @param {String} custom error message (optional)
 * @returns a promise for the resolution of the given promise if it is
 * fulfilled before the timeout, otherwise rejected.
 */
Q.timeout = function (object, ms, message) {
    return Q(object).timeout(ms, message);
};

Promise.prototype.timeout = function (ms, message) {
    var deferred = defer();
    var timeoutId = setTimeout(function () {
        deferred.reject(new Error(message || "Timed out after " + ms + " ms"));
    }, ms);

    this.then(function (value) {
        clearTimeout(timeoutId);
        deferred.resolve(value);
    }, function (exception) {
        clearTimeout(timeoutId);
        deferred.reject(exception);
    }, deferred.notify);

    return deferred.promise;
};

/**
 * Returns a promise for the given value (or promised value), some
 * milliseconds after it resolved. Passes rejections immediately.
 * @param {Any*} promise
 * @param {Number} milliseconds
 * @returns a promise for the resolution of the given promise after milliseconds
 * time has elapsed since the resolution of the given promise.
 * If the given promise rejects, that is passed immediately.
 */
Q.delay = function (object, timeout) {
    if (timeout === void 0) {
        timeout = object;
        object = void 0;
    }
    return Q(object).delay(timeout);
};

Promise.prototype.delay = function (timeout) {
    return this.then(function (value) {
        var deferred = defer();
        setTimeout(function () {
            deferred.resolve(value);
        }, timeout);
        return deferred.promise;
    });
};

/**
 * Passes a continuation to a Node function, which is called with the given
 * arguments provided as an array, and returns a promise.
 *
 *      Q.nfapply(FS.readFile, [__filename])
 *      .then(function (content) {
 *      })
 *
 */
Q.nfapply = function (callback, args) {
    return Q(callback).nfapply(args);
};

Promise.prototype.nfapply = function (args) {
    var deferred = defer();
    var nodeArgs = array_slice(args);
    nodeArgs.push(deferred.makeNodeResolver());
    this.fapply(nodeArgs).fail(deferred.reject);
    return deferred.promise;
};

/**
 * Passes a continuation to a Node function, which is called with the given
 * arguments provided individually, and returns a promise.
 * @example
 * Q.nfcall(FS.readFile, __filename)
 * .then(function (content) {
 * })
 *
 */
Q.nfcall = function (callback /*...args*/) {
    var args = array_slice(arguments, 1);
    return Q(callback).nfapply(args);
};

Promise.prototype.nfcall = function (/*...args*/) {
    var nodeArgs = array_slice(arguments);
    var deferred = defer();
    nodeArgs.push(deferred.makeNodeResolver());
    this.fapply(nodeArgs).fail(deferred.reject);
    return deferred.promise;
};

/**
 * Wraps a NodeJS continuation passing function and returns an equivalent
 * version that returns a promise.
 * @example
 * Q.nfbind(FS.readFile, __filename)("utf-8")
 * .then(console.log)
 * .done()
 */
Q.nfbind =
Q.denodeify = function (callback /*...args*/) {
    var baseArgs = array_slice(arguments, 1);
    return function () {
        var nodeArgs = baseArgs.concat(array_slice(arguments));
        var deferred = defer();
        nodeArgs.push(deferred.makeNodeResolver());
        Q(callback).fapply(nodeArgs).fail(deferred.reject);
        return deferred.promise;
    };
};

Promise.prototype.nfbind =
Promise.prototype.denodeify = function (/*...args*/) {
    var args = array_slice(arguments);
    args.unshift(this);
    return Q.denodeify.apply(void 0, args);
};

Q.nbind = function (callback, thisp /*...args*/) {
    var baseArgs = array_slice(arguments, 2);
    return function () {
        var nodeArgs = baseArgs.concat(array_slice(arguments));
        var deferred = defer();
        nodeArgs.push(deferred.makeNodeResolver());
        function bound() {
            return callback.apply(thisp, arguments);
        }
        Q(bound).fapply(nodeArgs).fail(deferred.reject);
        return deferred.promise;
    };
};

Promise.prototype.nbind = function (/*thisp, ...args*/) {
    var args = array_slice(arguments, 0);
    args.unshift(this);
    return Q.nbind.apply(void 0, args);
};

/**
 * Calls a method of a Node-style object that accepts a Node-style
 * callback with a given array of arguments, plus a provided callback.
 * @param object an object that has the named method
 * @param {String} name name of the method of object
 * @param {Array} args arguments to pass to the method; the callback
 * will be provided by Q and appended to these arguments.
 * @returns a promise for the value or error
 */
Q.nmapply = // XXX As proposed by "Redsandro"
Q.npost = function (object, name, args) {
    return Q(object).npost(name, args);
};

Promise.prototype.nmapply = // XXX As proposed by "Redsandro"
Promise.prototype.npost = function (name, args) {
    var nodeArgs = array_slice(args || []);
    var deferred = defer();
    nodeArgs.push(deferred.makeNodeResolver());
    this.dispatch("post", [name, nodeArgs]).fail(deferred.reject);
    return deferred.promise;
};

/**
 * Calls a method of a Node-style object that accepts a Node-style
 * callback, forwarding the given variadic arguments, plus a provided
 * callback argument.
 * @param object an object that has the named method
 * @param {String} name name of the method of object
 * @param ...args arguments to pass to the method; the callback will
 * be provided by Q and appended to these arguments.
 * @returns a promise for the value or error
 */
Q.nsend = // XXX Based on Mark Miller's proposed "send"
Q.nmcall = // XXX Based on "Redsandro's" proposal
Q.ninvoke = function (object, name /*...args*/) {
    var nodeArgs = array_slice(arguments, 2);
    var deferred = defer();
    nodeArgs.push(deferred.makeNodeResolver());
    Q(object).dispatch("post", [name, nodeArgs]).fail(deferred.reject);
    return deferred.promise;
};

Promise.prototype.nsend = // XXX Based on Mark Miller's proposed "send"
Promise.prototype.nmcall = // XXX Based on "Redsandro's" proposal
Promise.prototype.ninvoke = function (name /*...args*/) {
    var nodeArgs = array_slice(arguments, 1);
    var deferred = defer();
    nodeArgs.push(deferred.makeNodeResolver());
    this.dispatch("post", [name, nodeArgs]).fail(deferred.reject);
    return deferred.promise;
};

/**
 * If a function would like to support both Node continuation-passing-style and
 * promise-returning-style, it can end its internal promise chain with
 * `nodeify(nodeback)`, forwarding the optional nodeback argument.  If the user
 * elects to use a nodeback, the result will be sent there.  If they do not
 * pass a nodeback, they will receive the result promise.
 * @param object a result (or a promise for a result)
 * @param {Function} nodeback a Node.js-style callback
 * @returns either the promise or nothing
 */
Q.nodeify = nodeify;
function nodeify(object, nodeback) {
    return Q(object).nodeify(nodeback);
}

Promise.prototype.nodeify = function (nodeback) {
    if (nodeback) {
        this.then(function (value) {
            nextTick(function () {
                nodeback(null, value);
            });
        }, function (error) {
            nextTick(function () {
                nodeback(error);
            });
        });
    } else {
        return this;
    }
};

// All code before this point will be filtered from stack traces.
var qEndingLine = captureLine();

return Q;

});
})
}).call(this,require("C:\\projects\\Tribe\\node_modules\\tribe\\node_modules\\browserify\\node_modules\\insert-module-globals\\node_modules\\process\\browser.js"))
},{"C:\\projects\\Tribe\\node_modules\\tribe\\node_modules\\browserify\\node_modules\\insert-module-globals\\node_modules\\process\\browser.js":33,"tribe/client/enhancedDebug":97}],80:[function(require,module,exports){
require("tribe/client/enhancedDebug").execute("ko.bindingHandlers.effects = {\n    update: function (element, valueAccessor, allBindings, viewModel, bindingContext) {\n        var effects = valueAccessor();\n        for (var i = 0, l = effects().length; i < l; i++)\n            effects()[i](element);\n        effects([]);\n    }\n};\n\nko.bindingHandlers.image = {\n    update: function (element, valueAccessor, allBindings, viewModel, bindingContext) {\n        $(element).css('background-image', 'url(images/' + valueAccessor() + ')');\n    }\n};\n\nvar isTouch = 'ontouchstart' in document.documentElement;\nko.bindingHandlers.tap = {\n    init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {\n        var startTime;\n        $(element)\n            .on('touchstart', function (e) {\n                if ($(e.target).closest(element)) {\n                    $(element).addClass('active');\n                    startTime = startTime || (new Date()).getTime();\n                    e.stopPropagation();\n                }\n            })\n            .on('touchend', function (e) {\n                $(element).removeClass('active');\n                if ($(e.target).closest(element) && startTime) {\n                    var endTime = (new Date()).getTime();\n                    if (endTime - startTime < 200)\n                        valueAccessor()(viewModel, e);\n                    startTime = undefined;\n                    e.stopPropagation();\n                }\n            });\n    }\n};\n\nko.bindingHandlers.hold = {\n    init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {\n        var timer;\n        $(element)\n            .on('touchstart', function (e) {\n                timer = timer || setTimeout(function () {\n                    valueAccessor()(viewModel, e);\n                }, 200);\n                e.stopPropagation();\n            })\n            .on('touchend', function (e) {\n                clearTimeout(timer);\n                timer = undefined;\n                e.stopPropagation();\n            });\n    }\n};\n//@ sourceURL=http://app/node_modules/ui/bindingHandlers.js\n", arguments, window, require, module, exports);
(function () {ko.bindingHandlers.effects = {
    update: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
        var effects = valueAccessor();
        for (var i = 0, l = effects().length; i < l; i++)
            effects()[i](element);
        effects([]);
    }
};

ko.bindingHandlers.image = {
    update: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
        $(element).css('background-image', 'url(images/' + valueAccessor() + ')');
    }
};

var isTouch = 'ontouchstart' in document.documentElement;
ko.bindingHandlers.tap = {
    init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
        var startTime;
        $(element)
            .on('touchstart', function (e) {
                if ($(e.target).closest(element)) {
                    $(element).addClass('active');
                    startTime = startTime || (new Date()).getTime();
                    e.stopPropagation();
                }
            })
            .on('touchend', function (e) {
                $(element).removeClass('active');
                if ($(e.target).closest(element) && startTime) {
                    var endTime = (new Date()).getTime();
                    if (endTime - startTime < 200)
                        valueAccessor()(viewModel, e);
                    startTime = undefined;
                    e.stopPropagation();
                }
            });
    }
};

ko.bindingHandlers.hold = {
    init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
        var timer;
        $(element)
            .on('touchstart', function (e) {
                timer = timer || setTimeout(function () {
                    valueAccessor()(viewModel, e);
                }, 200);
                e.stopPropagation();
            })
            .on('touchend', function (e) {
                clearTimeout(timer);
                timer = undefined;
                e.stopPropagation();
            });
    }
};})
},{"tribe/client/enhancedDebug":97}],81:[function(require,module,exports){
require("tribe/client/enhancedDebug").execute("module.exports = function (value) {\n    return function (element) {\n        var effect = $('<div><div>' + Math.abs(value) + '</div></div>')\n            .addClass('damage' + (value < 0 ? ' heal' : ''))\n            .appendTo('body')\n            .css($(element).offset())\n            .bind('transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd', function () {\n                effect.remove();\n            });\n\n        setTimeout(function () {\n            effect.children().addClass('animate');\n        }, 15);\n    };\n};\n//@ sourceURL=http://app/node_modules/ui/effects/damage.js\n", arguments, window, require, module, exports);
(function () {module.exports = function (value) {
    return function (element) {
        var effect = $('<div><div>' + Math.abs(value) + '</div></div>')
            .addClass('damage' + (value < 0 ? ' heal' : ''))
            .appendTo('body')
            .css($(element).offset())
            .bind('transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd', function () {
                effect.remove();
            });

        setTimeout(function () {
            effect.children().addClass('animate');
        }, 15);
    };
};})
},{"tribe/client/enhancedDebug":97}],82:[function(require,module,exports){
require("tribe/client/enhancedDebug").execute("var location = require('utilities/location');\n\nmodule.exports = function (object, from, to, map) {\n    var path = location.path(from, to),\n        nextLocation = path.next();\n\n    // possibly make this more efficient by directly modifying the HTML rather than moving an object on the map\n\n    // take the first step and add the object to the map\n    map.addObject(object, nextLocation);\n\n    // move the object towards the target allowing other code to run in the process\n    setTimeout(nextStep, 10);\n    function nextStep() {\n        nextLocation = path.next();\n        if (nextLocation) {\n            map.move(object, nextLocation);\n            setTimeout(nextStep, 10);\n        } else {\n            // make a decision about whether or not to leave the object on the map\n            map.removeObject(object);\n        }\n    }\n};\n//@ sourceURL=http://app/node_modules/ui/effects/projectile.js\n", arguments, window, require, module, exports);
(function () {var location = require('utilities/location');

module.exports = function (object, from, to, map) {
    var path = location.path(from, to),
        nextLocation = path.next();

    // possibly make this more efficient by directly modifying the HTML rather than moving an object on the map

    // take the first step and add the object to the map
    map.addObject(object, nextLocation);

    // move the object towards the target allowing other code to run in the process
    setTimeout(nextStep, 10);
    function nextStep() {
        nextLocation = path.next();
        if (nextLocation) {
            map.move(object, nextLocation);
            setTimeout(nextStep, 10);
        } else {
            // make a decision about whether or not to leave the object on the map
            map.removeObject(object);
        }
    }
};})
},{"tribe/client/enhancedDebug":97,"utilities/location":89}],83:[function(require,module,exports){
require("tribe/client/enhancedDebug").execute("var objects = require('objects'),\n    utils = require('utilities/location'),\n    _ = require('underscore');\n\nmodule.exports = {\n    forLocation: function (map, location, object) {\n        var tile = map.tile(location),\n            action = {\n                action: 'move',\n                objectId: object.id,\n                options: { location: location }\n            };\n\n        if(tile.contains({ type: 'creature', friendly: false }))\n            action.action = 'attack';\n\n        return action;\n    },\n    forAttackAngle: function (map, angle, object) {\n        var sourceTile = map.tile(object.location()),\n            beam = utils.path.beam(object.location(), angle),\n            canSeeTiles = true;\n\n        while (canSeeTiles) {\n            canSeeTiles = false;\n\n            var sorted = _.sortBy(beam.next(), distance),\n                closestEnemy = _.find(sorted, function (location) {\n                    if (sourceTile.canSee(location)) {\n                        canSeeTiles = true;\n                        return map.tile(location).contains({ type: 'creature', friendly: false });\n                    }\n                });\n\n            if(closestEnemy)\n                return {\n                    action: 'attack',\n                    objectId: object.id,\n                    options: { location: closestEnemy }\n                };\n        }\n\n\n        function distance(location) {\n            return utils.distance(object.location(), location);\n        }\n    },\n    forPlayerLocation: function (map, location, object) {\n        var objects = map.tile(location).objects(),\n            actions = [];\n\n        if (objects.length > 2)\n            actions.push({\n                tap: { topic: 'action.queue.acquire', data: { action: 'acquire', objectId: object.id, options: { location: location } } },\n                hold: { topic: 'ui.showLocationItems', data: location },\n                icon: 'acquire'\n            });\n        return actions;\n    }\n};\n//@ sourceURL=http://app/node_modules/ui/input/actions.js\n", arguments, window, require, module, exports);
(function () {var objects = require('objects'),
    utils = require('utilities/location'),
    _ = require('underscore');

module.exports = {
    forLocation: function (map, location, object) {
        var tile = map.tile(location),
            action = {
                action: 'move',
                objectId: object.id,
                options: { location: location }
            };

        if(tile.contains({ type: 'creature', friendly: false }))
            action.action = 'attack';

        return action;
    },
    forAttackAngle: function (map, angle, object) {
        var sourceTile = map.tile(object.location()),
            beam = utils.path.beam(object.location(), angle),
            canSeeTiles = true;

        while (canSeeTiles) {
            canSeeTiles = false;

            var sorted = _.sortBy(beam.next(), distance),
                closestEnemy = _.find(sorted, function (location) {
                    if (sourceTile.canSee(location)) {
                        canSeeTiles = true;
                        return map.tile(location).contains({ type: 'creature', friendly: false });
                    }
                });

            if(closestEnemy)
                return {
                    action: 'attack',
                    objectId: object.id,
                    options: { location: closestEnemy }
                };
        }


        function distance(location) {
            return utils.distance(object.location(), location);
        }
    },
    forPlayerLocation: function (map, location, object) {
        var objects = map.tile(location).objects(),
            actions = [];

        if (objects.length > 2)
            actions.push({
                tap: { topic: 'action.queue.acquire', data: { action: 'acquire', objectId: object.id, options: { location: location } } },
                hold: { topic: 'ui.showLocationItems', data: location },
                icon: 'acquire'
            });
        return actions;
    }
};})
},{"objects":67,"tribe/client/enhancedDebug":97,"underscore":87,"utilities/location":89}],84:[function(require,module,exports){
require("tribe/client/enhancedDebug").execute("var actions = require('./actions'),\n    location = require('utilities/location'),\n    pubsub = require('tribe').pubsub;\n\nmodule.exports = {\n    attach: function (player, map) {\n        $(window).keydown(function (e) {\n            switch(e.keyCode) {\n                case 33: act('ne'); break;\n                case 34: act('se'); break;\n                case 35: act('sw'); break;\n                case 36: act('nw'); break;\n                case 37: act('w'); break;\n                case 38: act('n'); break;\n                case 39: act('e'); break;\n                case 40: act('s'); break;\n            }\n\n            function act(direction) {\n                var action = actions.forLocation(map, location.direction(direction, player.location()), player);\n                pubsub.publish('action.queue.' + action.action, action);\n                e.preventDefault();\n            }\n        });\n    }\n};\n//@ sourceURL=http://app/node_modules/ui/input/keyboard.js\n", arguments, window, require, module, exports);
(function () {var actions = require('./actions'),
    location = require('utilities/location'),
    pubsub = require('tribe').pubsub;

module.exports = {
    attach: function (player, map) {
        $(window).keydown(function (e) {
            switch(e.keyCode) {
                case 33: act('ne'); break;
                case 34: act('se'); break;
                case 35: act('sw'); break;
                case 36: act('nw'); break;
                case 37: act('w'); break;
                case 38: act('n'); break;
                case 39: act('e'); break;
                case 40: act('s'); break;
            }

            function act(direction) {
                var action = actions.forLocation(map, location.direction(direction, player.location()), player);
                pubsub.publish('action.queue.' + action.action, action);
                e.preventDefault();
            }
        });
    }
};})
},{"./actions":83,"tribe":"truKqQ","tribe/client/enhancedDebug":97,"utilities/location":89}],85:[function(require,module,exports){
require("tribe/client/enhancedDebug").execute("var tile = require('./tile'),\n    _ = require('underscore');\n\nmodule.exports = function (map) {\n    return {\n        tiles: _.map(map.tiles, function (row) {\n            return _.map(row, tile);\n        }),\n        addEffect: function (row, col, effect) {\n            this.tiles[row][col].effects.push(effect);\n        }\n    };\n};\n//@ sourceURL=http://app/node_modules/ui/models/map.js\n", arguments, window, require, module, exports);
(function () {var tile = require('./tile'),
    _ = require('underscore');

module.exports = function (map) {
    return {
        tiles: _.map(map.tiles, function (row) {
            return _.map(row, tile);
        }),
        addEffect: function (row, col, effect) {
            this.tiles[row][col].effects.push(effect);
        }
    };
};})
},{"./tile":86,"tribe/client/enhancedDebug":97,"underscore":87}],86:[function(require,module,exports){
require("tribe/client/enhancedDebug").execute("module.exports = function (tile) {\n    return {\n        content: function () {\n            var objects = tile.objects();\n            var tileDefinition = objects.length > 0 && objects[objects.length - 1].data.tile;\n            return tileDefinition && tileDefinition.content || '';\n        },\n        style: function () {\n            var objects = tile.objects();\n            var style = {};\n            for (var i = objects.length - 1; i >= 0; i--) {\n                var tileDefinition = objects[i].data.tile;\n                if (tileDefinition) {\n                    if (tileDefinition.background && !style.background)\n                        style.background = tileDefinition.background;\n\n                    if (tileDefinition.color && !style.color)\n                        style.color = tileDefinition.color;\n                }\n            }\n            return style;\n        },\n        effects: ko.observableArray()\n    };\n};\n//@ sourceURL=http://app/node_modules/ui/models/tile.js\n", arguments, window, require, module, exports);
(function () {module.exports = function (tile) {
    return {
        content: function () {
            var objects = tile.objects();
            var tileDefinition = objects.length > 0 && objects[objects.length - 1].data.tile;
            return tileDefinition && tileDefinition.content || '';
        },
        style: function () {
            var objects = tile.objects();
            var style = {};
            for (var i = objects.length - 1; i >= 0; i--) {
                var tileDefinition = objects[i].data.tile;
                if (tileDefinition) {
                    if (tileDefinition.background && !style.background)
                        style.background = tileDefinition.background;

                    if (tileDefinition.color && !style.color)
                        style.color = tileDefinition.color;
                }
            }
            return style;
        },
        effects: ko.observableArray()
    };
};})
},{"tribe/client/enhancedDebug":97}],87:[function(require,module,exports){
require("tribe/client/enhancedDebug").execute("//     Underscore.js 1.6.0\n//     http://underscorejs.org\n//     (c) 2009-2014 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors\n//     Underscore may be freely distributed under the MIT license.\n\n(function() {\n\n  // Baseline setup\n  // --------------\n\n  // Establish the root object, `window` in the browser, or `exports` on the server.\n  var root = this;\n\n  // Save the previous value of the `_` variable.\n  var previousUnderscore = root._;\n\n  // Establish the object that gets returned to break out of a loop iteration.\n  var breaker = {};\n\n  // Save bytes in the minified (but not gzipped) version:\n  var ArrayProto = Array.prototype, ObjProto = Object.prototype, FuncProto = Function.prototype;\n\n  // Create quick reference variables for speed access to core prototypes.\n  var\n    push             = ArrayProto.push,\n    slice            = ArrayProto.slice,\n    concat           = ArrayProto.concat,\n    toString         = ObjProto.toString,\n    hasOwnProperty   = ObjProto.hasOwnProperty;\n\n  // All **ECMAScript 5** native function implementations that we hope to use\n  // are declared here.\n  var\n    nativeForEach      = ArrayProto.forEach,\n    nativeMap          = ArrayProto.map,\n    nativeReduce       = ArrayProto.reduce,\n    nativeReduceRight  = ArrayProto.reduceRight,\n    nativeFilter       = ArrayProto.filter,\n    nativeEvery        = ArrayProto.every,\n    nativeSome         = ArrayProto.some,\n    nativeIndexOf      = ArrayProto.indexOf,\n    nativeLastIndexOf  = ArrayProto.lastIndexOf,\n    nativeIsArray      = Array.isArray,\n    nativeKeys         = Object.keys,\n    nativeBind         = FuncProto.bind;\n\n  // Create a safe reference to the Underscore object for use below.\n  var _ = function(obj) {\n    if (obj instanceof _) return obj;\n    if (!(this instanceof _)) return new _(obj);\n    this._wrapped = obj;\n  };\n\n  // Export the Underscore object for **Node.js**, with\n  // backwards-compatibility for the old `require()` API. If we're in\n  // the browser, add `_` as a global object via a string identifier,\n  // for Closure Compiler \"advanced\" mode.\n  if (typeof exports !== 'undefined') {\n    if (typeof module !== 'undefined' && module.exports) {\n      exports = module.exports = _;\n    }\n    exports._ = _;\n  } else {\n    root._ = _;\n  }\n\n  // Current version.\n  _.VERSION = '1.6.0';\n\n  // Collection Functions\n  // --------------------\n\n  // The cornerstone, an `each` implementation, aka `forEach`.\n  // Handles objects with the built-in `forEach`, arrays, and raw objects.\n  // Delegates to **ECMAScript 5**'s native `forEach` if available.\n  var each = _.each = _.forEach = function(obj, iterator, context) {\n    if (obj == null) return obj;\n    if (nativeForEach && obj.forEach === nativeForEach) {\n      obj.forEach(iterator, context);\n    } else if (obj.length === +obj.length) {\n      for (var i = 0, length = obj.length; i < length; i++) {\n        if (iterator.call(context, obj[i], i, obj) === breaker) return;\n      }\n    } else {\n      var keys = _.keys(obj);\n      for (var i = 0, length = keys.length; i < length; i++) {\n        if (iterator.call(context, obj[keys[i]], keys[i], obj) === breaker) return;\n      }\n    }\n    return obj;\n  };\n\n  // Return the results of applying the iterator to each element.\n  // Delegates to **ECMAScript 5**'s native `map` if available.\n  _.map = _.collect = function(obj, iterator, context) {\n    var results = [];\n    if (obj == null) return results;\n    if (nativeMap && obj.map === nativeMap) return obj.map(iterator, context);\n    each(obj, function(value, index, list) {\n      results.push(iterator.call(context, value, index, list));\n    });\n    return results;\n  };\n\n  var reduceError = 'Reduce of empty array with no initial value';\n\n  // **Reduce** builds up a single result from a list of values, aka `inject`,\n  // or `foldl`. Delegates to **ECMAScript 5**'s native `reduce` if available.\n  _.reduce = _.foldl = _.inject = function(obj, iterator, memo, context) {\n    var initial = arguments.length > 2;\n    if (obj == null) obj = [];\n    if (nativeReduce && obj.reduce === nativeReduce) {\n      if (context) iterator = _.bind(iterator, context);\n      return initial ? obj.reduce(iterator, memo) : obj.reduce(iterator);\n    }\n    each(obj, function(value, index, list) {\n      if (!initial) {\n        memo = value;\n        initial = true;\n      } else {\n        memo = iterator.call(context, memo, value, index, list);\n      }\n    });\n    if (!initial) throw new TypeError(reduceError);\n    return memo;\n  };\n\n  // The right-associative version of reduce, also known as `foldr`.\n  // Delegates to **ECMAScript 5**'s native `reduceRight` if available.\n  _.reduceRight = _.foldr = function(obj, iterator, memo, context) {\n    var initial = arguments.length > 2;\n    if (obj == null) obj = [];\n    if (nativeReduceRight && obj.reduceRight === nativeReduceRight) {\n      if (context) iterator = _.bind(iterator, context);\n      return initial ? obj.reduceRight(iterator, memo) : obj.reduceRight(iterator);\n    }\n    var length = obj.length;\n    if (length !== +length) {\n      var keys = _.keys(obj);\n      length = keys.length;\n    }\n    each(obj, function(value, index, list) {\n      index = keys ? keys[--length] : --length;\n      if (!initial) {\n        memo = obj[index];\n        initial = true;\n      } else {\n        memo = iterator.call(context, memo, obj[index], index, list);\n      }\n    });\n    if (!initial) throw new TypeError(reduceError);\n    return memo;\n  };\n\n  // Return the first value which passes a truth test. Aliased as `detect`.\n  _.find = _.detect = function(obj, predicate, context) {\n    var result;\n    any(obj, function(value, index, list) {\n      if (predicate.call(context, value, index, list)) {\n        result = value;\n        return true;\n      }\n    });\n    return result;\n  };\n\n  // Return all the elements that pass a truth test.\n  // Delegates to **ECMAScript 5**'s native `filter` if available.\n  // Aliased as `select`.\n  _.filter = _.select = function(obj, predicate, context) {\n    var results = [];\n    if (obj == null) return results;\n    if (nativeFilter && obj.filter === nativeFilter) return obj.filter(predicate, context);\n    each(obj, function(value, index, list) {\n      if (predicate.call(context, value, index, list)) results.push(value);\n    });\n    return results;\n  };\n\n  // Return all the elements for which a truth test fails.\n  _.reject = function(obj, predicate, context) {\n    return _.filter(obj, function(value, index, list) {\n      return !predicate.call(context, value, index, list);\n    }, context);\n  };\n\n  // Determine whether all of the elements match a truth test.\n  // Delegates to **ECMAScript 5**'s native `every` if available.\n  // Aliased as `all`.\n  _.every = _.all = function(obj, predicate, context) {\n    predicate || (predicate = _.identity);\n    var result = true;\n    if (obj == null) return result;\n    if (nativeEvery && obj.every === nativeEvery) return obj.every(predicate, context);\n    each(obj, function(value, index, list) {\n      if (!(result = result && predicate.call(context, value, index, list))) return breaker;\n    });\n    return !!result;\n  };\n\n  // Determine if at least one element in the object matches a truth test.\n  // Delegates to **ECMAScript 5**'s native `some` if available.\n  // Aliased as `any`.\n  var any = _.some = _.any = function(obj, predicate, context) {\n    predicate || (predicate = _.identity);\n    var result = false;\n    if (obj == null) return result;\n    if (nativeSome && obj.some === nativeSome) return obj.some(predicate, context);\n    each(obj, function(value, index, list) {\n      if (result || (result = predicate.call(context, value, index, list))) return breaker;\n    });\n    return !!result;\n  };\n\n  // Determine if the array or object contains a given value (using `===`).\n  // Aliased as `include`.\n  _.contains = _.include = function(obj, target) {\n    if (obj == null) return false;\n    if (nativeIndexOf && obj.indexOf === nativeIndexOf) return obj.indexOf(target) != -1;\n    return any(obj, function(value) {\n      return value === target;\n    });\n  };\n\n  // Invoke a method (with arguments) on every item in a collection.\n  _.invoke = function(obj, method) {\n    var args = slice.call(arguments, 2);\n    var isFunc = _.isFunction(method);\n    return _.map(obj, function(value) {\n      return (isFunc ? method : value[method]).apply(value, args);\n    });\n  };\n\n  // Convenience version of a common use case of `map`: fetching a property.\n  _.pluck = function(obj, key) {\n    return _.map(obj, _.property(key));\n  };\n\n  // Convenience version of a common use case of `filter`: selecting only objects\n  // containing specific `key:value` pairs.\n  _.where = function(obj, attrs) {\n    return _.filter(obj, _.matches(attrs));\n  };\n\n  // Convenience version of a common use case of `find`: getting the first object\n  // containing specific `key:value` pairs.\n  _.findWhere = function(obj, attrs) {\n    return _.find(obj, _.matches(attrs));\n  };\n\n  // Return the maximum element or (element-based computation).\n  // Can't optimize arrays of integers longer than 65,535 elements.\n  // See [WebKit Bug 80797](https://bugs.webkit.org/show_bug.cgi?id=80797)\n  _.max = function(obj, iterator, context) {\n    if (!iterator && _.isArray(obj) && obj[0] === +obj[0] && obj.length < 65535) {\n      return Math.max.apply(Math, obj);\n    }\n    var result = -Infinity, lastComputed = -Infinity;\n    each(obj, function(value, index, list) {\n      var computed = iterator ? iterator.call(context, value, index, list) : value;\n      if (computed > lastComputed) {\n        result = value;\n        lastComputed = computed;\n      }\n    });\n    return result;\n  };\n\n  // Return the minimum element (or element-based computation).\n  _.min = function(obj, iterator, context) {\n    if (!iterator && _.isArray(obj) && obj[0] === +obj[0] && obj.length < 65535) {\n      return Math.min.apply(Math, obj);\n    }\n    var result = Infinity, lastComputed = Infinity;\n    each(obj, function(value, index, list) {\n      var computed = iterator ? iterator.call(context, value, index, list) : value;\n      if (computed < lastComputed) {\n        result = value;\n        lastComputed = computed;\n      }\n    });\n    return result;\n  };\n\n  // Shuffle an array, using the modern version of the\n  // [Fisher-Yates shuffle](http://en.wikipedia.org/wiki/Fisher–Yates_shuffle).\n  _.shuffle = function(obj) {\n    var rand;\n    var index = 0;\n    var shuffled = [];\n    each(obj, function(value) {\n      rand = _.random(index++);\n      shuffled[index - 1] = shuffled[rand];\n      shuffled[rand] = value;\n    });\n    return shuffled;\n  };\n\n  // Sample **n** random values from a collection.\n  // If **n** is not specified, returns a single random element.\n  // The internal `guard` argument allows it to work with `map`.\n  _.sample = function(obj, n, guard) {\n    if (n == null || guard) {\n      if (obj.length !== +obj.length) obj = _.values(obj);\n      return obj[_.random(obj.length - 1)];\n    }\n    return _.shuffle(obj).slice(0, Math.max(0, n));\n  };\n\n  // An internal function to generate lookup iterators.\n  var lookupIterator = function(value) {\n    if (value == null) return _.identity;\n    if (_.isFunction(value)) return value;\n    return _.property(value);\n  };\n\n  // Sort the object's values by a criterion produced by an iterator.\n  _.sortBy = function(obj, iterator, context) {\n    iterator = lookupIterator(iterator);\n    return _.pluck(_.map(obj, function(value, index, list) {\n      return {\n        value: value,\n        index: index,\n        criteria: iterator.call(context, value, index, list)\n      };\n    }).sort(function(left, right) {\n      var a = left.criteria;\n      var b = right.criteria;\n      if (a !== b) {\n        if (a > b || a === void 0) return 1;\n        if (a < b || b === void 0) return -1;\n      }\n      return left.index - right.index;\n    }), 'value');\n  };\n\n  // An internal function used for aggregate \"group by\" operations.\n  var group = function(behavior) {\n    return function(obj, iterator, context) {\n      var result = {};\n      iterator = lookupIterator(iterator);\n      each(obj, function(value, index) {\n        var key = iterator.call(context, value, index, obj);\n        behavior(result, key, value);\n      });\n      return result;\n    };\n  };\n\n  // Groups the object's values by a criterion. Pass either a string attribute\n  // to group by, or a function that returns the criterion.\n  _.groupBy = group(function(result, key, value) {\n    _.has(result, key) ? result[key].push(value) : result[key] = [value];\n  });\n\n  // Indexes the object's values by a criterion, similar to `groupBy`, but for\n  // when you know that your index values will be unique.\n  _.indexBy = group(function(result, key, value) {\n    result[key] = value;\n  });\n\n  // Counts instances of an object that group by a certain criterion. Pass\n  // either a string attribute to count by, or a function that returns the\n  // criterion.\n  _.countBy = group(function(result, key) {\n    _.has(result, key) ? result[key]++ : result[key] = 1;\n  });\n\n  // Use a comparator function to figure out the smallest index at which\n  // an object should be inserted so as to maintain order. Uses binary search.\n  _.sortedIndex = function(array, obj, iterator, context) {\n    iterator = lookupIterator(iterator);\n    var value = iterator.call(context, obj);\n    var low = 0, high = array.length;\n    while (low < high) {\n      var mid = (low + high) >>> 1;\n      iterator.call(context, array[mid]) < value ? low = mid + 1 : high = mid;\n    }\n    return low;\n  };\n\n  // Safely create a real, live array from anything iterable.\n  _.toArray = function(obj) {\n    if (!obj) return [];\n    if (_.isArray(obj)) return slice.call(obj);\n    if (obj.length === +obj.length) return _.map(obj, _.identity);\n    return _.values(obj);\n  };\n\n  // Return the number of elements in an object.\n  _.size = function(obj) {\n    if (obj == null) return 0;\n    return (obj.length === +obj.length) ? obj.length : _.keys(obj).length;\n  };\n\n  // Array Functions\n  // ---------------\n\n  // Get the first element of an array. Passing **n** will return the first N\n  // values in the array. Aliased as `head` and `take`. The **guard** check\n  // allows it to work with `_.map`.\n  _.first = _.head = _.take = function(array, n, guard) {\n    if (array == null) return void 0;\n    if ((n == null) || guard) return array[0];\n    if (n < 0) return [];\n    return slice.call(array, 0, n);\n  };\n\n  // Returns everything but the last entry of the array. Especially useful on\n  // the arguments object. Passing **n** will return all the values in\n  // the array, excluding the last N. The **guard** check allows it to work with\n  // `_.map`.\n  _.initial = function(array, n, guard) {\n    return slice.call(array, 0, array.length - ((n == null) || guard ? 1 : n));\n  };\n\n  // Get the last element of an array. Passing **n** will return the last N\n  // values in the array. The **guard** check allows it to work with `_.map`.\n  _.last = function(array, n, guard) {\n    if (array == null) return void 0;\n    if ((n == null) || guard) return array[array.length - 1];\n    return slice.call(array, Math.max(array.length - n, 0));\n  };\n\n  // Returns everything but the first entry of the array. Aliased as `tail` and `drop`.\n  // Especially useful on the arguments object. Passing an **n** will return\n  // the rest N values in the array. The **guard**\n  // check allows it to work with `_.map`.\n  _.rest = _.tail = _.drop = function(array, n, guard) {\n    return slice.call(array, (n == null) || guard ? 1 : n);\n  };\n\n  // Trim out all falsy values from an array.\n  _.compact = function(array) {\n    return _.filter(array, _.identity);\n  };\n\n  // Internal implementation of a recursive `flatten` function.\n  var flatten = function(input, shallow, output) {\n    if (shallow && _.every(input, _.isArray)) {\n      return concat.apply(output, input);\n    }\n    each(input, function(value) {\n      if (_.isArray(value) || _.isArguments(value)) {\n        shallow ? push.apply(output, value) : flatten(value, shallow, output);\n      } else {\n        output.push(value);\n      }\n    });\n    return output;\n  };\n\n  // Flatten out an array, either recursively (by default), or just one level.\n  _.flatten = function(array, shallow) {\n    return flatten(array, shallow, []);\n  };\n\n  // Return a version of the array that does not contain the specified value(s).\n  _.without = function(array) {\n    return _.difference(array, slice.call(arguments, 1));\n  };\n\n  // Split an array into two arrays: one whose elements all satisfy the given\n  // predicate, and one whose elements all do not satisfy the predicate.\n  _.partition = function(array, predicate) {\n    var pass = [], fail = [];\n    each(array, function(elem) {\n      (predicate(elem) ? pass : fail).push(elem);\n    });\n    return [pass, fail];\n  };\n\n  // Produce a duplicate-free version of the array. If the array has already\n  // been sorted, you have the option of using a faster algorithm.\n  // Aliased as `unique`.\n  _.uniq = _.unique = function(array, isSorted, iterator, context) {\n    if (_.isFunction(isSorted)) {\n      context = iterator;\n      iterator = isSorted;\n      isSorted = false;\n    }\n    var initial = iterator ? _.map(array, iterator, context) : array;\n    var results = [];\n    var seen = [];\n    each(initial, function(value, index) {\n      if (isSorted ? (!index || seen[seen.length - 1] !== value) : !_.contains(seen, value)) {\n        seen.push(value);\n        results.push(array[index]);\n      }\n    });\n    return results;\n  };\n\n  // Produce an array that contains the union: each distinct element from all of\n  // the passed-in arrays.\n  _.union = function() {\n    return _.uniq(_.flatten(arguments, true));\n  };\n\n  // Produce an array that contains every item shared between all the\n  // passed-in arrays.\n  _.intersection = function(array) {\n    var rest = slice.call(arguments, 1);\n    return _.filter(_.uniq(array), function(item) {\n      return _.every(rest, function(other) {\n        return _.contains(other, item);\n      });\n    });\n  };\n\n  // Take the difference between one array and a number of other arrays.\n  // Only the elements present in just the first array will remain.\n  _.difference = function(array) {\n    var rest = concat.apply(ArrayProto, slice.call(arguments, 1));\n    return _.filter(array, function(value){ return !_.contains(rest, value); });\n  };\n\n  // Zip together multiple lists into a single array -- elements that share\n  // an index go together.\n  _.zip = function() {\n    var length = _.max(_.pluck(arguments, 'length').concat(0));\n    var results = new Array(length);\n    for (var i = 0; i < length; i++) {\n      results[i] = _.pluck(arguments, '' + i);\n    }\n    return results;\n  };\n\n  // Converts lists into objects. Pass either a single array of `[key, value]`\n  // pairs, or two parallel arrays of the same length -- one of keys, and one of\n  // the corresponding values.\n  _.object = function(list, values) {\n    if (list == null) return {};\n    var result = {};\n    for (var i = 0, length = list.length; i < length; i++) {\n      if (values) {\n        result[list[i]] = values[i];\n      } else {\n        result[list[i][0]] = list[i][1];\n      }\n    }\n    return result;\n  };\n\n  // If the browser doesn't supply us with indexOf (I'm looking at you, **MSIE**),\n  // we need this function. Return the position of the first occurrence of an\n  // item in an array, or -1 if the item is not included in the array.\n  // Delegates to **ECMAScript 5**'s native `indexOf` if available.\n  // If the array is large and already in sort order, pass `true`\n  // for **isSorted** to use binary search.\n  _.indexOf = function(array, item, isSorted) {\n    if (array == null) return -1;\n    var i = 0, length = array.length;\n    if (isSorted) {\n      if (typeof isSorted == 'number') {\n        i = (isSorted < 0 ? Math.max(0, length + isSorted) : isSorted);\n      } else {\n        i = _.sortedIndex(array, item);\n        return array[i] === item ? i : -1;\n      }\n    }\n    if (nativeIndexOf && array.indexOf === nativeIndexOf) return array.indexOf(item, isSorted);\n    for (; i < length; i++) if (array[i] === item) return i;\n    return -1;\n  };\n\n  // Delegates to **ECMAScript 5**'s native `lastIndexOf` if available.\n  _.lastIndexOf = function(array, item, from) {\n    if (array == null) return -1;\n    var hasIndex = from != null;\n    if (nativeLastIndexOf && array.lastIndexOf === nativeLastIndexOf) {\n      return hasIndex ? array.lastIndexOf(item, from) : array.lastIndexOf(item);\n    }\n    var i = (hasIndex ? from : array.length);\n    while (i--) if (array[i] === item) return i;\n    return -1;\n  };\n\n  // Generate an integer Array containing an arithmetic progression. A port of\n  // the native Python `range()` function. See\n  // [the Python documentation](http://docs.python.org/library/functions.html#range).\n  _.range = function(start, stop, step) {\n    if (arguments.length <= 1) {\n      stop = start || 0;\n      start = 0;\n    }\n    step = arguments[2] || 1;\n\n    var length = Math.max(Math.ceil((stop - start) / step), 0);\n    var idx = 0;\n    var range = new Array(length);\n\n    while(idx < length) {\n      range[idx++] = start;\n      start += step;\n    }\n\n    return range;\n  };\n\n  // Function (ahem) Functions\n  // ------------------\n\n  // Reusable constructor function for prototype setting.\n  var ctor = function(){};\n\n  // Create a function bound to a given object (assigning `this`, and arguments,\n  // optionally). Delegates to **ECMAScript 5**'s native `Function.bind` if\n  // available.\n  _.bind = function(func, context) {\n    var args, bound;\n    if (nativeBind && func.bind === nativeBind) return nativeBind.apply(func, slice.call(arguments, 1));\n    if (!_.isFunction(func)) throw new TypeError;\n    args = slice.call(arguments, 2);\n    return bound = function() {\n      if (!(this instanceof bound)) return func.apply(context, args.concat(slice.call(arguments)));\n      ctor.prototype = func.prototype;\n      var self = new ctor;\n      ctor.prototype = null;\n      var result = func.apply(self, args.concat(slice.call(arguments)));\n      if (Object(result) === result) return result;\n      return self;\n    };\n  };\n\n  // Partially apply a function by creating a version that has had some of its\n  // arguments pre-filled, without changing its dynamic `this` context. _ acts\n  // as a placeholder, allowing any combination of arguments to be pre-filled.\n  _.partial = function(func) {\n    var boundArgs = slice.call(arguments, 1);\n    return function() {\n      var position = 0;\n      var args = boundArgs.slice();\n      for (var i = 0, length = args.length; i < length; i++) {\n        if (args[i] === _) args[i] = arguments[position++];\n      }\n      while (position < arguments.length) args.push(arguments[position++]);\n      return func.apply(this, args);\n    };\n  };\n\n  // Bind a number of an object's methods to that object. Remaining arguments\n  // are the method names to be bound. Useful for ensuring that all callbacks\n  // defined on an object belong to it.\n  _.bindAll = function(obj) {\n    var funcs = slice.call(arguments, 1);\n    if (funcs.length === 0) throw new Error('bindAll must be passed function names');\n    each(funcs, function(f) { obj[f] = _.bind(obj[f], obj); });\n    return obj;\n  };\n\n  // Memoize an expensive function by storing its results.\n  _.memoize = function(func, hasher) {\n    var memo = {};\n    hasher || (hasher = _.identity);\n    return function() {\n      var key = hasher.apply(this, arguments);\n      return _.has(memo, key) ? memo[key] : (memo[key] = func.apply(this, arguments));\n    };\n  };\n\n  // Delays a function for the given number of milliseconds, and then calls\n  // it with the arguments supplied.\n  _.delay = function(func, wait) {\n    var args = slice.call(arguments, 2);\n    return setTimeout(function(){ return func.apply(null, args); }, wait);\n  };\n\n  // Defers a function, scheduling it to run after the current call stack has\n  // cleared.\n  _.defer = function(func) {\n    return _.delay.apply(_, [func, 1].concat(slice.call(arguments, 1)));\n  };\n\n  // Returns a function, that, when invoked, will only be triggered at most once\n  // during a given window of time. Normally, the throttled function will run\n  // as much as it can, without ever going more than once per `wait` duration;\n  // but if you'd like to disable the execution on the leading edge, pass\n  // `{leading: false}`. To disable execution on the trailing edge, ditto.\n  _.throttle = function(func, wait, options) {\n    var context, args, result;\n    var timeout = null;\n    var previous = 0;\n    options || (options = {});\n    var later = function() {\n      previous = options.leading === false ? 0 : _.now();\n      timeout = null;\n      result = func.apply(context, args);\n      context = args = null;\n    };\n    return function() {\n      var now = _.now();\n      if (!previous && options.leading === false) previous = now;\n      var remaining = wait - (now - previous);\n      context = this;\n      args = arguments;\n      if (remaining <= 0) {\n        clearTimeout(timeout);\n        timeout = null;\n        previous = now;\n        result = func.apply(context, args);\n        context = args = null;\n      } else if (!timeout && options.trailing !== false) {\n        timeout = setTimeout(later, remaining);\n      }\n      return result;\n    };\n  };\n\n  // Returns a function, that, as long as it continues to be invoked, will not\n  // be triggered. The function will be called after it stops being called for\n  // N milliseconds. If `immediate` is passed, trigger the function on the\n  // leading edge, instead of the trailing.\n  _.debounce = function(func, wait, immediate) {\n    var timeout, args, context, timestamp, result;\n\n    var later = function() {\n      var last = _.now() - timestamp;\n      if (last < wait) {\n        timeout = setTimeout(later, wait - last);\n      } else {\n        timeout = null;\n        if (!immediate) {\n          result = func.apply(context, args);\n          context = args = null;\n        }\n      }\n    };\n\n    return function() {\n      context = this;\n      args = arguments;\n      timestamp = _.now();\n      var callNow = immediate && !timeout;\n      if (!timeout) {\n        timeout = setTimeout(later, wait);\n      }\n      if (callNow) {\n        result = func.apply(context, args);\n        context = args = null;\n      }\n\n      return result;\n    };\n  };\n\n  // Returns a function that will be executed at most one time, no matter how\n  // often you call it. Useful for lazy initialization.\n  _.once = function(func) {\n    var ran = false, memo;\n    return function() {\n      if (ran) return memo;\n      ran = true;\n      memo = func.apply(this, arguments);\n      func = null;\n      return memo;\n    };\n  };\n\n  // Returns the first function passed as an argument to the second,\n  // allowing you to adjust arguments, run code before and after, and\n  // conditionally execute the original function.\n  _.wrap = function(func, wrapper) {\n    return _.partial(wrapper, func);\n  };\n\n  // Returns a function that is the composition of a list of functions, each\n  // consuming the return value of the function that follows.\n  _.compose = function() {\n    var funcs = arguments;\n    return function() {\n      var args = arguments;\n      for (var i = funcs.length - 1; i >= 0; i--) {\n        args = [funcs[i].apply(this, args)];\n      }\n      return args[0];\n    };\n  };\n\n  // Returns a function that will only be executed after being called N times.\n  _.after = function(times, func) {\n    return function() {\n      if (--times < 1) {\n        return func.apply(this, arguments);\n      }\n    };\n  };\n\n  // Object Functions\n  // ----------------\n\n  // Retrieve the names of an object's properties.\n  // Delegates to **ECMAScript 5**'s native `Object.keys`\n  _.keys = function(obj) {\n    if (!_.isObject(obj)) return [];\n    if (nativeKeys) return nativeKeys(obj);\n    var keys = [];\n    for (var key in obj) if (_.has(obj, key)) keys.push(key);\n    return keys;\n  };\n\n  // Retrieve the values of an object's properties.\n  _.values = function(obj) {\n    var keys = _.keys(obj);\n    var length = keys.length;\n    var values = new Array(length);\n    for (var i = 0; i < length; i++) {\n      values[i] = obj[keys[i]];\n    }\n    return values;\n  };\n\n  // Convert an object into a list of `[key, value]` pairs.\n  _.pairs = function(obj) {\n    var keys = _.keys(obj);\n    var length = keys.length;\n    var pairs = new Array(length);\n    for (var i = 0; i < length; i++) {\n      pairs[i] = [keys[i], obj[keys[i]]];\n    }\n    return pairs;\n  };\n\n  // Invert the keys and values of an object. The values must be serializable.\n  _.invert = function(obj) {\n    var result = {};\n    var keys = _.keys(obj);\n    for (var i = 0, length = keys.length; i < length; i++) {\n      result[obj[keys[i]]] = keys[i];\n    }\n    return result;\n  };\n\n  // Return a sorted list of the function names available on the object.\n  // Aliased as `methods`\n  _.functions = _.methods = function(obj) {\n    var names = [];\n    for (var key in obj) {\n      if (_.isFunction(obj[key])) names.push(key);\n    }\n    return names.sort();\n  };\n\n  // Extend a given object with all the properties in passed-in object(s).\n  _.extend = function(obj) {\n    each(slice.call(arguments, 1), function(source) {\n      if (source) {\n        for (var prop in source) {\n          obj[prop] = source[prop];\n        }\n      }\n    });\n    return obj;\n  };\n\n  // Return a copy of the object only containing the whitelisted properties.\n  _.pick = function(obj) {\n    var copy = {};\n    var keys = concat.apply(ArrayProto, slice.call(arguments, 1));\n    each(keys, function(key) {\n      if (key in obj) copy[key] = obj[key];\n    });\n    return copy;\n  };\n\n   // Return a copy of the object without the blacklisted properties.\n  _.omit = function(obj) {\n    var copy = {};\n    var keys = concat.apply(ArrayProto, slice.call(arguments, 1));\n    for (var key in obj) {\n      if (!_.contains(keys, key)) copy[key] = obj[key];\n    }\n    return copy;\n  };\n\n  // Fill in a given object with default properties.\n  _.defaults = function(obj) {\n    each(slice.call(arguments, 1), function(source) {\n      if (source) {\n        for (var prop in source) {\n          if (obj[prop] === void 0) obj[prop] = source[prop];\n        }\n      }\n    });\n    return obj;\n  };\n\n  // Create a (shallow-cloned) duplicate of an object.\n  _.clone = function(obj) {\n    if (!_.isObject(obj)) return obj;\n    return _.isArray(obj) ? obj.slice() : _.extend({}, obj);\n  };\n\n  // Invokes interceptor with the obj, and then returns obj.\n  // The primary purpose of this method is to \"tap into\" a method chain, in\n  // order to perform operations on intermediate results within the chain.\n  _.tap = function(obj, interceptor) {\n    interceptor(obj);\n    return obj;\n  };\n\n  // Internal recursive comparison function for `isEqual`.\n  var eq = function(a, b, aStack, bStack) {\n    // Identical objects are equal. `0 === -0`, but they aren't identical.\n    // See the [Harmony `egal` proposal](http://wiki.ecmascript.org/doku.php?id=harmony:egal).\n    if (a === b) return a !== 0 || 1 / a == 1 / b;\n    // A strict comparison is necessary because `null == undefined`.\n    if (a == null || b == null) return a === b;\n    // Unwrap any wrapped objects.\n    if (a instanceof _) a = a._wrapped;\n    if (b instanceof _) b = b._wrapped;\n    // Compare `[[Class]]` names.\n    var className = toString.call(a);\n    if (className != toString.call(b)) return false;\n    switch (className) {\n      // Strings, numbers, dates, and booleans are compared by value.\n      case '[object String]':\n        // Primitives and their corresponding object wrappers are equivalent; thus, `\"5\"` is\n        // equivalent to `new String(\"5\")`.\n        return a == String(b);\n      case '[object Number]':\n        // `NaN`s are equivalent, but non-reflexive. An `egal` comparison is performed for\n        // other numeric values.\n        return a != +a ? b != +b : (a == 0 ? 1 / a == 1 / b : a == +b);\n      case '[object Date]':\n      case '[object Boolean]':\n        // Coerce dates and booleans to numeric primitive values. Dates are compared by their\n        // millisecond representations. Note that invalid dates with millisecond representations\n        // of `NaN` are not equivalent.\n        return +a == +b;\n      // RegExps are compared by their source patterns and flags.\n      case '[object RegExp]':\n        return a.source == b.source &&\n               a.global == b.global &&\n               a.multiline == b.multiline &&\n               a.ignoreCase == b.ignoreCase;\n    }\n    if (typeof a != 'object' || typeof b != 'object') return false;\n    // Assume equality for cyclic structures. The algorithm for detecting cyclic\n    // structures is adapted from ES 5.1 section 15.12.3, abstract operation `JO`.\n    var length = aStack.length;\n    while (length--) {\n      // Linear search. Performance is inversely proportional to the number of\n      // unique nested structures.\n      if (aStack[length] == a) return bStack[length] == b;\n    }\n    // Objects with different constructors are not equivalent, but `Object`s\n    // from different frames are.\n    var aCtor = a.constructor, bCtor = b.constructor;\n    if (aCtor !== bCtor && !(_.isFunction(aCtor) && (aCtor instanceof aCtor) &&\n                             _.isFunction(bCtor) && (bCtor instanceof bCtor))\n                        && ('constructor' in a && 'constructor' in b)) {\n      return false;\n    }\n    // Add the first object to the stack of traversed objects.\n    aStack.push(a);\n    bStack.push(b);\n    var size = 0, result = true;\n    // Recursively compare objects and arrays.\n    if (className == '[object Array]') {\n      // Compare array lengths to determine if a deep comparison is necessary.\n      size = a.length;\n      result = size == b.length;\n      if (result) {\n        // Deep compare the contents, ignoring non-numeric properties.\n        while (size--) {\n          if (!(result = eq(a[size], b[size], aStack, bStack))) break;\n        }\n      }\n    } else {\n      // Deep compare objects.\n      for (var key in a) {\n        if (_.has(a, key)) {\n          // Count the expected number of properties.\n          size++;\n          // Deep compare each member.\n          if (!(result = _.has(b, key) && eq(a[key], b[key], aStack, bStack))) break;\n        }\n      }\n      // Ensure that both objects contain the same number of properties.\n      if (result) {\n        for (key in b) {\n          if (_.has(b, key) && !(size--)) break;\n        }\n        result = !size;\n      }\n    }\n    // Remove the first object from the stack of traversed objects.\n    aStack.pop();\n    bStack.pop();\n    return result;\n  };\n\n  // Perform a deep comparison to check if two objects are equal.\n  _.isEqual = function(a, b) {\n    return eq(a, b, [], []);\n  };\n\n  // Is a given array, string, or object empty?\n  // An \"empty\" object has no enumerable own-properties.\n  _.isEmpty = function(obj) {\n    if (obj == null) return true;\n    if (_.isArray(obj) || _.isString(obj)) return obj.length === 0;\n    for (var key in obj) if (_.has(obj, key)) return false;\n    return true;\n  };\n\n  // Is a given value a DOM element?\n  _.isElement = function(obj) {\n    return !!(obj && obj.nodeType === 1);\n  };\n\n  // Is a given value an array?\n  // Delegates to ECMA5's native Array.isArray\n  _.isArray = nativeIsArray || function(obj) {\n    return toString.call(obj) == '[object Array]';\n  };\n\n  // Is a given variable an object?\n  _.isObject = function(obj) {\n    return obj === Object(obj);\n  };\n\n  // Add some isType methods: isArguments, isFunction, isString, isNumber, isDate, isRegExp.\n  each(['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp'], function(name) {\n    _['is' + name] = function(obj) {\n      return toString.call(obj) == '[object ' + name + ']';\n    };\n  });\n\n  // Define a fallback version of the method in browsers (ahem, IE), where\n  // there isn't any inspectable \"Arguments\" type.\n  if (!_.isArguments(arguments)) {\n    _.isArguments = function(obj) {\n      return !!(obj && _.has(obj, 'callee'));\n    };\n  }\n\n  // Optimize `isFunction` if appropriate.\n  if (typeof (/./) !== 'function') {\n    _.isFunction = function(obj) {\n      return typeof obj === 'function';\n    };\n  }\n\n  // Is a given object a finite number?\n  _.isFinite = function(obj) {\n    return isFinite(obj) && !isNaN(parseFloat(obj));\n  };\n\n  // Is the given value `NaN`? (NaN is the only number which does not equal itself).\n  _.isNaN = function(obj) {\n    return _.isNumber(obj) && obj != +obj;\n  };\n\n  // Is a given value a boolean?\n  _.isBoolean = function(obj) {\n    return obj === true || obj === false || toString.call(obj) == '[object Boolean]';\n  };\n\n  // Is a given value equal to null?\n  _.isNull = function(obj) {\n    return obj === null;\n  };\n\n  // Is a given variable undefined?\n  _.isUndefined = function(obj) {\n    return obj === void 0;\n  };\n\n  // Shortcut function for checking if an object has a given property directly\n  // on itself (in other words, not on a prototype).\n  _.has = function(obj, key) {\n    return hasOwnProperty.call(obj, key);\n  };\n\n  // Utility Functions\n  // -----------------\n\n  // Run Underscore.js in *noConflict* mode, returning the `_` variable to its\n  // previous owner. Returns a reference to the Underscore object.\n  _.noConflict = function() {\n    root._ = previousUnderscore;\n    return this;\n  };\n\n  // Keep the identity function around for default iterators.\n  _.identity = function(value) {\n    return value;\n  };\n\n  _.constant = function(value) {\n    return function () {\n      return value;\n    };\n  };\n\n  _.property = function(key) {\n    return function(obj) {\n      return obj[key];\n    };\n  };\n\n  // Returns a predicate for checking whether an object has a given set of `key:value` pairs.\n  _.matches = function(attrs) {\n    return function(obj) {\n      if (obj === attrs) return true; //avoid comparing an object to itself.\n      for (var key in attrs) {\n        if (attrs[key] !== obj[key])\n          return false;\n      }\n      return true;\n    }\n  };\n\n  // Run a function **n** times.\n  _.times = function(n, iterator, context) {\n    var accum = Array(Math.max(0, n));\n    for (var i = 0; i < n; i++) accum[i] = iterator.call(context, i);\n    return accum;\n  };\n\n  // Return a random integer between min and max (inclusive).\n  _.random = function(min, max) {\n    if (max == null) {\n      max = min;\n      min = 0;\n    }\n    return min + Math.floor(Math.random() * (max - min + 1));\n  };\n\n  // A (possibly faster) way to get the current timestamp as an integer.\n  _.now = Date.now || function() { return new Date().getTime(); };\n\n  // List of HTML entities for escaping.\n  var entityMap = {\n    escape: {\n      '&': '&amp;',\n      '<': '&lt;',\n      '>': '&gt;',\n      '\"': '&quot;',\n      \"'\": '&#x27;'\n    }\n  };\n  entityMap.unescape = _.invert(entityMap.escape);\n\n  // Regexes containing the keys and values listed immediately above.\n  var entityRegexes = {\n    escape:   new RegExp('[' + _.keys(entityMap.escape).join('') + ']', 'g'),\n    unescape: new RegExp('(' + _.keys(entityMap.unescape).join('|') + ')', 'g')\n  };\n\n  // Functions for escaping and unescaping strings to/from HTML interpolation.\n  _.each(['escape', 'unescape'], function(method) {\n    _[method] = function(string) {\n      if (string == null) return '';\n      return ('' + string).replace(entityRegexes[method], function(match) {\n        return entityMap[method][match];\n      });\n    };\n  });\n\n  // If the value of the named `property` is a function then invoke it with the\n  // `object` as context; otherwise, return it.\n  _.result = function(object, property) {\n    if (object == null) return void 0;\n    var value = object[property];\n    return _.isFunction(value) ? value.call(object) : value;\n  };\n\n  // Add your own custom functions to the Underscore object.\n  _.mixin = function(obj) {\n    each(_.functions(obj), function(name) {\n      var func = _[name] = obj[name];\n      _.prototype[name] = function() {\n        var args = [this._wrapped];\n        push.apply(args, arguments);\n        return result.call(this, func.apply(_, args));\n      };\n    });\n  };\n\n  // Generate a unique integer id (unique within the entire client session).\n  // Useful for temporary DOM ids.\n  var idCounter = 0;\n  _.uniqueId = function(prefix) {\n    var id = ++idCounter + '';\n    return prefix ? prefix + id : id;\n  };\n\n  // By default, Underscore uses ERB-style template delimiters, change the\n  // following template settings to use alternative delimiters.\n  _.templateSettings = {\n    evaluate    : /<%([\\s\\S]+?)%>/g,\n    interpolate : /<%=([\\s\\S]+?)%>/g,\n    escape      : /<%-([\\s\\S]+?)%>/g\n  };\n\n  // When customizing `templateSettings`, if you don't want to define an\n  // interpolation, evaluation or escaping regex, we need one that is\n  // guaranteed not to match.\n  var noMatch = /(.)^/;\n\n  // Certain characters need to be escaped so that they can be put into a\n  // string literal.\n  var escapes = {\n    \"'\":      \"'\",\n    '\\\\':     '\\\\',\n    '\\r':     'r',\n    '\\n':     'n',\n    '\\t':     't',\n    '\\u2028': 'u2028',\n    '\\u2029': 'u2029'\n  };\n\n  var escaper = /\\\\|'|\\r|\\n|\\t|\\u2028|\\u2029/g;\n\n  // JavaScript micro-templating, similar to John Resig's implementation.\n  // Underscore templating handles arbitrary delimiters, preserves whitespace,\n  // and correctly escapes quotes within interpolated code.\n  _.template = function(text, data, settings) {\n    var render;\n    settings = _.defaults({}, settings, _.templateSettings);\n\n    // Combine delimiters into one regular expression via alternation.\n    var matcher = new RegExp([\n      (settings.escape || noMatch).source,\n      (settings.interpolate || noMatch).source,\n      (settings.evaluate || noMatch).source\n    ].join('|') + '|$', 'g');\n\n    // Compile the template source, escaping string literals appropriately.\n    var index = 0;\n    var source = \"__p+='\";\n    text.replace(matcher, function(match, escape, interpolate, evaluate, offset) {\n      source += text.slice(index, offset)\n        .replace(escaper, function(match) { return '\\\\' + escapes[match]; });\n\n      if (escape) {\n        source += \"'+\\n((__t=(\" + escape + \"))==null?'':_.escape(__t))+\\n'\";\n      }\n      if (interpolate) {\n        source += \"'+\\n((__t=(\" + interpolate + \"))==null?'':__t)+\\n'\";\n      }\n      if (evaluate) {\n        source += \"';\\n\" + evaluate + \"\\n__p+='\";\n      }\n      index = offset + match.length;\n      return match;\n    });\n    source += \"';\\n\";\n\n    // If a variable is not specified, place data values in local scope.\n    if (!settings.variable) source = 'with(obj||{}){\\n' + source + '}\\n';\n\n    source = \"var __t,__p='',__j=Array.prototype.join,\" +\n      \"print=function(){__p+=__j.call(arguments,'');};\\n\" +\n      source + \"return __p;\\n\";\n\n    try {\n      render = new Function(settings.variable || 'obj', '_', source);\n    } catch (e) {\n      e.source = source;\n      throw e;\n    }\n\n    if (data) return render(data, _);\n    var template = function(data) {\n      return render.call(this, data, _);\n    };\n\n    // Provide the compiled function source as a convenience for precompilation.\n    template.source = 'function(' + (settings.variable || 'obj') + '){\\n' + source + '}';\n\n    return template;\n  };\n\n  // Add a \"chain\" function, which will delegate to the wrapper.\n  _.chain = function(obj) {\n    return _(obj).chain();\n  };\n\n  // OOP\n  // ---------------\n  // If Underscore is called as a function, it returns a wrapped object that\n  // can be used OO-style. This wrapper holds altered versions of all the\n  // underscore functions. Wrapped objects may be chained.\n\n  // Helper function to continue chaining intermediate results.\n  var result = function(obj) {\n    return this._chain ? _(obj).chain() : obj;\n  };\n\n  // Add all of the Underscore functions to the wrapper object.\n  _.mixin(_);\n\n  // Add all mutator Array functions to the wrapper.\n  each(['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'], function(name) {\n    var method = ArrayProto[name];\n    _.prototype[name] = function() {\n      var obj = this._wrapped;\n      method.apply(obj, arguments);\n      if ((name == 'shift' || name == 'splice') && obj.length === 0) delete obj[0];\n      return result.call(this, obj);\n    };\n  });\n\n  // Add all accessor Array functions to the wrapper.\n  each(['concat', 'join', 'slice'], function(name) {\n    var method = ArrayProto[name];\n    _.prototype[name] = function() {\n      return result.call(this, method.apply(this._wrapped, arguments));\n    };\n  });\n\n  _.extend(_.prototype, {\n\n    // Start chaining a wrapped Underscore object.\n    chain: function() {\n      this._chain = true;\n      return this;\n    },\n\n    // Extracts the result from a wrapped and chained object.\n    value: function() {\n      return this._wrapped;\n    }\n\n  });\n\n  // AMD registration happens at the end for compatibility with AMD loaders\n  // that may not enforce next-turn semantics on modules. Even though general\n  // practice for AMD registration is to be anonymous, underscore registers\n  // as a named module because, like jQuery, it is a base library that is\n  // popular enough to be bundled in a third party lib, but not be part of\n  // an AMD load request. Those cases could generate an error when an\n  // anonymous define() is called outside of a loader request.\n  if (typeof define === 'function' && define.amd) {\n    define('underscore', [], function() {\n      return _;\n    });\n  }\n}).call(this);\n\n//@ sourceURL=http://app/node_modules/underscore/underscore.js\n", arguments, window, require, module, exports);
(function () {//     Underscore.js 1.6.0
//     http://underscorejs.org
//     (c) 2009-2014 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
//     Underscore may be freely distributed under the MIT license.

(function() {

  // Baseline setup
  // --------------

  // Establish the root object, `window` in the browser, or `exports` on the server.
  var root = this;

  // Save the previous value of the `_` variable.
  var previousUnderscore = root._;

  // Establish the object that gets returned to break out of a loop iteration.
  var breaker = {};

  // Save bytes in the minified (but not gzipped) version:
  var ArrayProto = Array.prototype, ObjProto = Object.prototype, FuncProto = Function.prototype;

  // Create quick reference variables for speed access to core prototypes.
  var
    push             = ArrayProto.push,
    slice            = ArrayProto.slice,
    concat           = ArrayProto.concat,
    toString         = ObjProto.toString,
    hasOwnProperty   = ObjProto.hasOwnProperty;

  // All **ECMAScript 5** native function implementations that we hope to use
  // are declared here.
  var
    nativeForEach      = ArrayProto.forEach,
    nativeMap          = ArrayProto.map,
    nativeReduce       = ArrayProto.reduce,
    nativeReduceRight  = ArrayProto.reduceRight,
    nativeFilter       = ArrayProto.filter,
    nativeEvery        = ArrayProto.every,
    nativeSome         = ArrayProto.some,
    nativeIndexOf      = ArrayProto.indexOf,
    nativeLastIndexOf  = ArrayProto.lastIndexOf,
    nativeIsArray      = Array.isArray,
    nativeKeys         = Object.keys,
    nativeBind         = FuncProto.bind;

  // Create a safe reference to the Underscore object for use below.
  var _ = function(obj) {
    if (obj instanceof _) return obj;
    if (!(this instanceof _)) return new _(obj);
    this._wrapped = obj;
  };

  // Export the Underscore object for **Node.js**, with
  // backwards-compatibility for the old `require()` API. If we're in
  // the browser, add `_` as a global object via a string identifier,
  // for Closure Compiler "advanced" mode.
  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = _;
    }
    exports._ = _;
  } else {
    root._ = _;
  }

  // Current version.
  _.VERSION = '1.6.0';

  // Collection Functions
  // --------------------

  // The cornerstone, an `each` implementation, aka `forEach`.
  // Handles objects with the built-in `forEach`, arrays, and raw objects.
  // Delegates to **ECMAScript 5**'s native `forEach` if available.
  var each = _.each = _.forEach = function(obj, iterator, context) {
    if (obj == null) return obj;
    if (nativeForEach && obj.forEach === nativeForEach) {
      obj.forEach(iterator, context);
    } else if (obj.length === +obj.length) {
      for (var i = 0, length = obj.length; i < length; i++) {
        if (iterator.call(context, obj[i], i, obj) === breaker) return;
      }
    } else {
      var keys = _.keys(obj);
      for (var i = 0, length = keys.length; i < length; i++) {
        if (iterator.call(context, obj[keys[i]], keys[i], obj) === breaker) return;
      }
    }
    return obj;
  };

  // Return the results of applying the iterator to each element.
  // Delegates to **ECMAScript 5**'s native `map` if available.
  _.map = _.collect = function(obj, iterator, context) {
    var results = [];
    if (obj == null) return results;
    if (nativeMap && obj.map === nativeMap) return obj.map(iterator, context);
    each(obj, function(value, index, list) {
      results.push(iterator.call(context, value, index, list));
    });
    return results;
  };

  var reduceError = 'Reduce of empty array with no initial value';

  // **Reduce** builds up a single result from a list of values, aka `inject`,
  // or `foldl`. Delegates to **ECMAScript 5**'s native `reduce` if available.
  _.reduce = _.foldl = _.inject = function(obj, iterator, memo, context) {
    var initial = arguments.length > 2;
    if (obj == null) obj = [];
    if (nativeReduce && obj.reduce === nativeReduce) {
      if (context) iterator = _.bind(iterator, context);
      return initial ? obj.reduce(iterator, memo) : obj.reduce(iterator);
    }
    each(obj, function(value, index, list) {
      if (!initial) {
        memo = value;
        initial = true;
      } else {
        memo = iterator.call(context, memo, value, index, list);
      }
    });
    if (!initial) throw new TypeError(reduceError);
    return memo;
  };

  // The right-associative version of reduce, also known as `foldr`.
  // Delegates to **ECMAScript 5**'s native `reduceRight` if available.
  _.reduceRight = _.foldr = function(obj, iterator, memo, context) {
    var initial = arguments.length > 2;
    if (obj == null) obj = [];
    if (nativeReduceRight && obj.reduceRight === nativeReduceRight) {
      if (context) iterator = _.bind(iterator, context);
      return initial ? obj.reduceRight(iterator, memo) : obj.reduceRight(iterator);
    }
    var length = obj.length;
    if (length !== +length) {
      var keys = _.keys(obj);
      length = keys.length;
    }
    each(obj, function(value, index, list) {
      index = keys ? keys[--length] : --length;
      if (!initial) {
        memo = obj[index];
        initial = true;
      } else {
        memo = iterator.call(context, memo, obj[index], index, list);
      }
    });
    if (!initial) throw new TypeError(reduceError);
    return memo;
  };

  // Return the first value which passes a truth test. Aliased as `detect`.
  _.find = _.detect = function(obj, predicate, context) {
    var result;
    any(obj, function(value, index, list) {
      if (predicate.call(context, value, index, list)) {
        result = value;
        return true;
      }
    });
    return result;
  };

  // Return all the elements that pass a truth test.
  // Delegates to **ECMAScript 5**'s native `filter` if available.
  // Aliased as `select`.
  _.filter = _.select = function(obj, predicate, context) {
    var results = [];
    if (obj == null) return results;
    if (nativeFilter && obj.filter === nativeFilter) return obj.filter(predicate, context);
    each(obj, function(value, index, list) {
      if (predicate.call(context, value, index, list)) results.push(value);
    });
    return results;
  };

  // Return all the elements for which a truth test fails.
  _.reject = function(obj, predicate, context) {
    return _.filter(obj, function(value, index, list) {
      return !predicate.call(context, value, index, list);
    }, context);
  };

  // Determine whether all of the elements match a truth test.
  // Delegates to **ECMAScript 5**'s native `every` if available.
  // Aliased as `all`.
  _.every = _.all = function(obj, predicate, context) {
    predicate || (predicate = _.identity);
    var result = true;
    if (obj == null) return result;
    if (nativeEvery && obj.every === nativeEvery) return obj.every(predicate, context);
    each(obj, function(value, index, list) {
      if (!(result = result && predicate.call(context, value, index, list))) return breaker;
    });
    return !!result;
  };

  // Determine if at least one element in the object matches a truth test.
  // Delegates to **ECMAScript 5**'s native `some` if available.
  // Aliased as `any`.
  var any = _.some = _.any = function(obj, predicate, context) {
    predicate || (predicate = _.identity);
    var result = false;
    if (obj == null) return result;
    if (nativeSome && obj.some === nativeSome) return obj.some(predicate, context);
    each(obj, function(value, index, list) {
      if (result || (result = predicate.call(context, value, index, list))) return breaker;
    });
    return !!result;
  };

  // Determine if the array or object contains a given value (using `===`).
  // Aliased as `include`.
  _.contains = _.include = function(obj, target) {
    if (obj == null) return false;
    if (nativeIndexOf && obj.indexOf === nativeIndexOf) return obj.indexOf(target) != -1;
    return any(obj, function(value) {
      return value === target;
    });
  };

  // Invoke a method (with arguments) on every item in a collection.
  _.invoke = function(obj, method) {
    var args = slice.call(arguments, 2);
    var isFunc = _.isFunction(method);
    return _.map(obj, function(value) {
      return (isFunc ? method : value[method]).apply(value, args);
    });
  };

  // Convenience version of a common use case of `map`: fetching a property.
  _.pluck = function(obj, key) {
    return _.map(obj, _.property(key));
  };

  // Convenience version of a common use case of `filter`: selecting only objects
  // containing specific `key:value` pairs.
  _.where = function(obj, attrs) {
    return _.filter(obj, _.matches(attrs));
  };

  // Convenience version of a common use case of `find`: getting the first object
  // containing specific `key:value` pairs.
  _.findWhere = function(obj, attrs) {
    return _.find(obj, _.matches(attrs));
  };

  // Return the maximum element or (element-based computation).
  // Can't optimize arrays of integers longer than 65,535 elements.
  // See [WebKit Bug 80797](https://bugs.webkit.org/show_bug.cgi?id=80797)
  _.max = function(obj, iterator, context) {
    if (!iterator && _.isArray(obj) && obj[0] === +obj[0] && obj.length < 65535) {
      return Math.max.apply(Math, obj);
    }
    var result = -Infinity, lastComputed = -Infinity;
    each(obj, function(value, index, list) {
      var computed = iterator ? iterator.call(context, value, index, list) : value;
      if (computed > lastComputed) {
        result = value;
        lastComputed = computed;
      }
    });
    return result;
  };

  // Return the minimum element (or element-based computation).
  _.min = function(obj, iterator, context) {
    if (!iterator && _.isArray(obj) && obj[0] === +obj[0] && obj.length < 65535) {
      return Math.min.apply(Math, obj);
    }
    var result = Infinity, lastComputed = Infinity;
    each(obj, function(value, index, list) {
      var computed = iterator ? iterator.call(context, value, index, list) : value;
      if (computed < lastComputed) {
        result = value;
        lastComputed = computed;
      }
    });
    return result;
  };

  // Shuffle an array, using the modern version of the
  // [Fisher-Yates shuffle](http://en.wikipedia.org/wiki/Fisher–Yates_shuffle).
  _.shuffle = function(obj) {
    var rand;
    var index = 0;
    var shuffled = [];
    each(obj, function(value) {
      rand = _.random(index++);
      shuffled[index - 1] = shuffled[rand];
      shuffled[rand] = value;
    });
    return shuffled;
  };

  // Sample **n** random values from a collection.
  // If **n** is not specified, returns a single random element.
  // The internal `guard` argument allows it to work with `map`.
  _.sample = function(obj, n, guard) {
    if (n == null || guard) {
      if (obj.length !== +obj.length) obj = _.values(obj);
      return obj[_.random(obj.length - 1)];
    }
    return _.shuffle(obj).slice(0, Math.max(0, n));
  };

  // An internal function to generate lookup iterators.
  var lookupIterator = function(value) {
    if (value == null) return _.identity;
    if (_.isFunction(value)) return value;
    return _.property(value);
  };

  // Sort the object's values by a criterion produced by an iterator.
  _.sortBy = function(obj, iterator, context) {
    iterator = lookupIterator(iterator);
    return _.pluck(_.map(obj, function(value, index, list) {
      return {
        value: value,
        index: index,
        criteria: iterator.call(context, value, index, list)
      };
    }).sort(function(left, right) {
      var a = left.criteria;
      var b = right.criteria;
      if (a !== b) {
        if (a > b || a === void 0) return 1;
        if (a < b || b === void 0) return -1;
      }
      return left.index - right.index;
    }), 'value');
  };

  // An internal function used for aggregate "group by" operations.
  var group = function(behavior) {
    return function(obj, iterator, context) {
      var result = {};
      iterator = lookupIterator(iterator);
      each(obj, function(value, index) {
        var key = iterator.call(context, value, index, obj);
        behavior(result, key, value);
      });
      return result;
    };
  };

  // Groups the object's values by a criterion. Pass either a string attribute
  // to group by, or a function that returns the criterion.
  _.groupBy = group(function(result, key, value) {
    _.has(result, key) ? result[key].push(value) : result[key] = [value];
  });

  // Indexes the object's values by a criterion, similar to `groupBy`, but for
  // when you know that your index values will be unique.
  _.indexBy = group(function(result, key, value) {
    result[key] = value;
  });

  // Counts instances of an object that group by a certain criterion. Pass
  // either a string attribute to count by, or a function that returns the
  // criterion.
  _.countBy = group(function(result, key) {
    _.has(result, key) ? result[key]++ : result[key] = 1;
  });

  // Use a comparator function to figure out the smallest index at which
  // an object should be inserted so as to maintain order. Uses binary search.
  _.sortedIndex = function(array, obj, iterator, context) {
    iterator = lookupIterator(iterator);
    var value = iterator.call(context, obj);
    var low = 0, high = array.length;
    while (low < high) {
      var mid = (low + high) >>> 1;
      iterator.call(context, array[mid]) < value ? low = mid + 1 : high = mid;
    }
    return low;
  };

  // Safely create a real, live array from anything iterable.
  _.toArray = function(obj) {
    if (!obj) return [];
    if (_.isArray(obj)) return slice.call(obj);
    if (obj.length === +obj.length) return _.map(obj, _.identity);
    return _.values(obj);
  };

  // Return the number of elements in an object.
  _.size = function(obj) {
    if (obj == null) return 0;
    return (obj.length === +obj.length) ? obj.length : _.keys(obj).length;
  };

  // Array Functions
  // ---------------

  // Get the first element of an array. Passing **n** will return the first N
  // values in the array. Aliased as `head` and `take`. The **guard** check
  // allows it to work with `_.map`.
  _.first = _.head = _.take = function(array, n, guard) {
    if (array == null) return void 0;
    if ((n == null) || guard) return array[0];
    if (n < 0) return [];
    return slice.call(array, 0, n);
  };

  // Returns everything but the last entry of the array. Especially useful on
  // the arguments object. Passing **n** will return all the values in
  // the array, excluding the last N. The **guard** check allows it to work with
  // `_.map`.
  _.initial = function(array, n, guard) {
    return slice.call(array, 0, array.length - ((n == null) || guard ? 1 : n));
  };

  // Get the last element of an array. Passing **n** will return the last N
  // values in the array. The **guard** check allows it to work with `_.map`.
  _.last = function(array, n, guard) {
    if (array == null) return void 0;
    if ((n == null) || guard) return array[array.length - 1];
    return slice.call(array, Math.max(array.length - n, 0));
  };

  // Returns everything but the first entry of the array. Aliased as `tail` and `drop`.
  // Especially useful on the arguments object. Passing an **n** will return
  // the rest N values in the array. The **guard**
  // check allows it to work with `_.map`.
  _.rest = _.tail = _.drop = function(array, n, guard) {
    return slice.call(array, (n == null) || guard ? 1 : n);
  };

  // Trim out all falsy values from an array.
  _.compact = function(array) {
    return _.filter(array, _.identity);
  };

  // Internal implementation of a recursive `flatten` function.
  var flatten = function(input, shallow, output) {
    if (shallow && _.every(input, _.isArray)) {
      return concat.apply(output, input);
    }
    each(input, function(value) {
      if (_.isArray(value) || _.isArguments(value)) {
        shallow ? push.apply(output, value) : flatten(value, shallow, output);
      } else {
        output.push(value);
      }
    });
    return output;
  };

  // Flatten out an array, either recursively (by default), or just one level.
  _.flatten = function(array, shallow) {
    return flatten(array, shallow, []);
  };

  // Return a version of the array that does not contain the specified value(s).
  _.without = function(array) {
    return _.difference(array, slice.call(arguments, 1));
  };

  // Split an array into two arrays: one whose elements all satisfy the given
  // predicate, and one whose elements all do not satisfy the predicate.
  _.partition = function(array, predicate) {
    var pass = [], fail = [];
    each(array, function(elem) {
      (predicate(elem) ? pass : fail).push(elem);
    });
    return [pass, fail];
  };

  // Produce a duplicate-free version of the array. If the array has already
  // been sorted, you have the option of using a faster algorithm.
  // Aliased as `unique`.
  _.uniq = _.unique = function(array, isSorted, iterator, context) {
    if (_.isFunction(isSorted)) {
      context = iterator;
      iterator = isSorted;
      isSorted = false;
    }
    var initial = iterator ? _.map(array, iterator, context) : array;
    var results = [];
    var seen = [];
    each(initial, function(value, index) {
      if (isSorted ? (!index || seen[seen.length - 1] !== value) : !_.contains(seen, value)) {
        seen.push(value);
        results.push(array[index]);
      }
    });
    return results;
  };

  // Produce an array that contains the union: each distinct element from all of
  // the passed-in arrays.
  _.union = function() {
    return _.uniq(_.flatten(arguments, true));
  };

  // Produce an array that contains every item shared between all the
  // passed-in arrays.
  _.intersection = function(array) {
    var rest = slice.call(arguments, 1);
    return _.filter(_.uniq(array), function(item) {
      return _.every(rest, function(other) {
        return _.contains(other, item);
      });
    });
  };

  // Take the difference between one array and a number of other arrays.
  // Only the elements present in just the first array will remain.
  _.difference = function(array) {
    var rest = concat.apply(ArrayProto, slice.call(arguments, 1));
    return _.filter(array, function(value){ return !_.contains(rest, value); });
  };

  // Zip together multiple lists into a single array -- elements that share
  // an index go together.
  _.zip = function() {
    var length = _.max(_.pluck(arguments, 'length').concat(0));
    var results = new Array(length);
    for (var i = 0; i < length; i++) {
      results[i] = _.pluck(arguments, '' + i);
    }
    return results;
  };

  // Converts lists into objects. Pass either a single array of `[key, value]`
  // pairs, or two parallel arrays of the same length -- one of keys, and one of
  // the corresponding values.
  _.object = function(list, values) {
    if (list == null) return {};
    var result = {};
    for (var i = 0, length = list.length; i < length; i++) {
      if (values) {
        result[list[i]] = values[i];
      } else {
        result[list[i][0]] = list[i][1];
      }
    }
    return result;
  };

  // If the browser doesn't supply us with indexOf (I'm looking at you, **MSIE**),
  // we need this function. Return the position of the first occurrence of an
  // item in an array, or -1 if the item is not included in the array.
  // Delegates to **ECMAScript 5**'s native `indexOf` if available.
  // If the array is large and already in sort order, pass `true`
  // for **isSorted** to use binary search.
  _.indexOf = function(array, item, isSorted) {
    if (array == null) return -1;
    var i = 0, length = array.length;
    if (isSorted) {
      if (typeof isSorted == 'number') {
        i = (isSorted < 0 ? Math.max(0, length + isSorted) : isSorted);
      } else {
        i = _.sortedIndex(array, item);
        return array[i] === item ? i : -1;
      }
    }
    if (nativeIndexOf && array.indexOf === nativeIndexOf) return array.indexOf(item, isSorted);
    for (; i < length; i++) if (array[i] === item) return i;
    return -1;
  };

  // Delegates to **ECMAScript 5**'s native `lastIndexOf` if available.
  _.lastIndexOf = function(array, item, from) {
    if (array == null) return -1;
    var hasIndex = from != null;
    if (nativeLastIndexOf && array.lastIndexOf === nativeLastIndexOf) {
      return hasIndex ? array.lastIndexOf(item, from) : array.lastIndexOf(item);
    }
    var i = (hasIndex ? from : array.length);
    while (i--) if (array[i] === item) return i;
    return -1;
  };

  // Generate an integer Array containing an arithmetic progression. A port of
  // the native Python `range()` function. See
  // [the Python documentation](http://docs.python.org/library/functions.html#range).
  _.range = function(start, stop, step) {
    if (arguments.length <= 1) {
      stop = start || 0;
      start = 0;
    }
    step = arguments[2] || 1;

    var length = Math.max(Math.ceil((stop - start) / step), 0);
    var idx = 0;
    var range = new Array(length);

    while(idx < length) {
      range[idx++] = start;
      start += step;
    }

    return range;
  };

  // Function (ahem) Functions
  // ------------------

  // Reusable constructor function for prototype setting.
  var ctor = function(){};

  // Create a function bound to a given object (assigning `this`, and arguments,
  // optionally). Delegates to **ECMAScript 5**'s native `Function.bind` if
  // available.
  _.bind = function(func, context) {
    var args, bound;
    if (nativeBind && func.bind === nativeBind) return nativeBind.apply(func, slice.call(arguments, 1));
    if (!_.isFunction(func)) throw new TypeError;
    args = slice.call(arguments, 2);
    return bound = function() {
      if (!(this instanceof bound)) return func.apply(context, args.concat(slice.call(arguments)));
      ctor.prototype = func.prototype;
      var self = new ctor;
      ctor.prototype = null;
      var result = func.apply(self, args.concat(slice.call(arguments)));
      if (Object(result) === result) return result;
      return self;
    };
  };

  // Partially apply a function by creating a version that has had some of its
  // arguments pre-filled, without changing its dynamic `this` context. _ acts
  // as a placeholder, allowing any combination of arguments to be pre-filled.
  _.partial = function(func) {
    var boundArgs = slice.call(arguments, 1);
    return function() {
      var position = 0;
      var args = boundArgs.slice();
      for (var i = 0, length = args.length; i < length; i++) {
        if (args[i] === _) args[i] = arguments[position++];
      }
      while (position < arguments.length) args.push(arguments[position++]);
      return func.apply(this, args);
    };
  };

  // Bind a number of an object's methods to that object. Remaining arguments
  // are the method names to be bound. Useful for ensuring that all callbacks
  // defined on an object belong to it.
  _.bindAll = function(obj) {
    var funcs = slice.call(arguments, 1);
    if (funcs.length === 0) throw new Error('bindAll must be passed function names');
    each(funcs, function(f) { obj[f] = _.bind(obj[f], obj); });
    return obj;
  };

  // Memoize an expensive function by storing its results.
  _.memoize = function(func, hasher) {
    var memo = {};
    hasher || (hasher = _.identity);
    return function() {
      var key = hasher.apply(this, arguments);
      return _.has(memo, key) ? memo[key] : (memo[key] = func.apply(this, arguments));
    };
  };

  // Delays a function for the given number of milliseconds, and then calls
  // it with the arguments supplied.
  _.delay = function(func, wait) {
    var args = slice.call(arguments, 2);
    return setTimeout(function(){ return func.apply(null, args); }, wait);
  };

  // Defers a function, scheduling it to run after the current call stack has
  // cleared.
  _.defer = function(func) {
    return _.delay.apply(_, [func, 1].concat(slice.call(arguments, 1)));
  };

  // Returns a function, that, when invoked, will only be triggered at most once
  // during a given window of time. Normally, the throttled function will run
  // as much as it can, without ever going more than once per `wait` duration;
  // but if you'd like to disable the execution on the leading edge, pass
  // `{leading: false}`. To disable execution on the trailing edge, ditto.
  _.throttle = function(func, wait, options) {
    var context, args, result;
    var timeout = null;
    var previous = 0;
    options || (options = {});
    var later = function() {
      previous = options.leading === false ? 0 : _.now();
      timeout = null;
      result = func.apply(context, args);
      context = args = null;
    };
    return function() {
      var now = _.now();
      if (!previous && options.leading === false) previous = now;
      var remaining = wait - (now - previous);
      context = this;
      args = arguments;
      if (remaining <= 0) {
        clearTimeout(timeout);
        timeout = null;
        previous = now;
        result = func.apply(context, args);
        context = args = null;
      } else if (!timeout && options.trailing !== false) {
        timeout = setTimeout(later, remaining);
      }
      return result;
    };
  };

  // Returns a function, that, as long as it continues to be invoked, will not
  // be triggered. The function will be called after it stops being called for
  // N milliseconds. If `immediate` is passed, trigger the function on the
  // leading edge, instead of the trailing.
  _.debounce = function(func, wait, immediate) {
    var timeout, args, context, timestamp, result;

    var later = function() {
      var last = _.now() - timestamp;
      if (last < wait) {
        timeout = setTimeout(later, wait - last);
      } else {
        timeout = null;
        if (!immediate) {
          result = func.apply(context, args);
          context = args = null;
        }
      }
    };

    return function() {
      context = this;
      args = arguments;
      timestamp = _.now();
      var callNow = immediate && !timeout;
      if (!timeout) {
        timeout = setTimeout(later, wait);
      }
      if (callNow) {
        result = func.apply(context, args);
        context = args = null;
      }

      return result;
    };
  };

  // Returns a function that will be executed at most one time, no matter how
  // often you call it. Useful for lazy initialization.
  _.once = function(func) {
    var ran = false, memo;
    return function() {
      if (ran) return memo;
      ran = true;
      memo = func.apply(this, arguments);
      func = null;
      return memo;
    };
  };

  // Returns the first function passed as an argument to the second,
  // allowing you to adjust arguments, run code before and after, and
  // conditionally execute the original function.
  _.wrap = function(func, wrapper) {
    return _.partial(wrapper, func);
  };

  // Returns a function that is the composition of a list of functions, each
  // consuming the return value of the function that follows.
  _.compose = function() {
    var funcs = arguments;
    return function() {
      var args = arguments;
      for (var i = funcs.length - 1; i >= 0; i--) {
        args = [funcs[i].apply(this, args)];
      }
      return args[0];
    };
  };

  // Returns a function that will only be executed after being called N times.
  _.after = function(times, func) {
    return function() {
      if (--times < 1) {
        return func.apply(this, arguments);
      }
    };
  };

  // Object Functions
  // ----------------

  // Retrieve the names of an object's properties.
  // Delegates to **ECMAScript 5**'s native `Object.keys`
  _.keys = function(obj) {
    if (!_.isObject(obj)) return [];
    if (nativeKeys) return nativeKeys(obj);
    var keys = [];
    for (var key in obj) if (_.has(obj, key)) keys.push(key);
    return keys;
  };

  // Retrieve the values of an object's properties.
  _.values = function(obj) {
    var keys = _.keys(obj);
    var length = keys.length;
    var values = new Array(length);
    for (var i = 0; i < length; i++) {
      values[i] = obj[keys[i]];
    }
    return values;
  };

  // Convert an object into a list of `[key, value]` pairs.
  _.pairs = function(obj) {
    var keys = _.keys(obj);
    var length = keys.length;
    var pairs = new Array(length);
    for (var i = 0; i < length; i++) {
      pairs[i] = [keys[i], obj[keys[i]]];
    }
    return pairs;
  };

  // Invert the keys and values of an object. The values must be serializable.
  _.invert = function(obj) {
    var result = {};
    var keys = _.keys(obj);
    for (var i = 0, length = keys.length; i < length; i++) {
      result[obj[keys[i]]] = keys[i];
    }
    return result;
  };

  // Return a sorted list of the function names available on the object.
  // Aliased as `methods`
  _.functions = _.methods = function(obj) {
    var names = [];
    for (var key in obj) {
      if (_.isFunction(obj[key])) names.push(key);
    }
    return names.sort();
  };

  // Extend a given object with all the properties in passed-in object(s).
  _.extend = function(obj) {
    each(slice.call(arguments, 1), function(source) {
      if (source) {
        for (var prop in source) {
          obj[prop] = source[prop];
        }
      }
    });
    return obj;
  };

  // Return a copy of the object only containing the whitelisted properties.
  _.pick = function(obj) {
    var copy = {};
    var keys = concat.apply(ArrayProto, slice.call(arguments, 1));
    each(keys, function(key) {
      if (key in obj) copy[key] = obj[key];
    });
    return copy;
  };

   // Return a copy of the object without the blacklisted properties.
  _.omit = function(obj) {
    var copy = {};
    var keys = concat.apply(ArrayProto, slice.call(arguments, 1));
    for (var key in obj) {
      if (!_.contains(keys, key)) copy[key] = obj[key];
    }
    return copy;
  };

  // Fill in a given object with default properties.
  _.defaults = function(obj) {
    each(slice.call(arguments, 1), function(source) {
      if (source) {
        for (var prop in source) {
          if (obj[prop] === void 0) obj[prop] = source[prop];
        }
      }
    });
    return obj;
  };

  // Create a (shallow-cloned) duplicate of an object.
  _.clone = function(obj) {
    if (!_.isObject(obj)) return obj;
    return _.isArray(obj) ? obj.slice() : _.extend({}, obj);
  };

  // Invokes interceptor with the obj, and then returns obj.
  // The primary purpose of this method is to "tap into" a method chain, in
  // order to perform operations on intermediate results within the chain.
  _.tap = function(obj, interceptor) {
    interceptor(obj);
    return obj;
  };

  // Internal recursive comparison function for `isEqual`.
  var eq = function(a, b, aStack, bStack) {
    // Identical objects are equal. `0 === -0`, but they aren't identical.
    // See the [Harmony `egal` proposal](http://wiki.ecmascript.org/doku.php?id=harmony:egal).
    if (a === b) return a !== 0 || 1 / a == 1 / b;
    // A strict comparison is necessary because `null == undefined`.
    if (a == null || b == null) return a === b;
    // Unwrap any wrapped objects.
    if (a instanceof _) a = a._wrapped;
    if (b instanceof _) b = b._wrapped;
    // Compare `[[Class]]` names.
    var className = toString.call(a);
    if (className != toString.call(b)) return false;
    switch (className) {
      // Strings, numbers, dates, and booleans are compared by value.
      case '[object String]':
        // Primitives and their corresponding object wrappers are equivalent; thus, `"5"` is
        // equivalent to `new String("5")`.
        return a == String(b);
      case '[object Number]':
        // `NaN`s are equivalent, but non-reflexive. An `egal` comparison is performed for
        // other numeric values.
        return a != +a ? b != +b : (a == 0 ? 1 / a == 1 / b : a == +b);
      case '[object Date]':
      case '[object Boolean]':
        // Coerce dates and booleans to numeric primitive values. Dates are compared by their
        // millisecond representations. Note that invalid dates with millisecond representations
        // of `NaN` are not equivalent.
        return +a == +b;
      // RegExps are compared by their source patterns and flags.
      case '[object RegExp]':
        return a.source == b.source &&
               a.global == b.global &&
               a.multiline == b.multiline &&
               a.ignoreCase == b.ignoreCase;
    }
    if (typeof a != 'object' || typeof b != 'object') return false;
    // Assume equality for cyclic structures. The algorithm for detecting cyclic
    // structures is adapted from ES 5.1 section 15.12.3, abstract operation `JO`.
    var length = aStack.length;
    while (length--) {
      // Linear search. Performance is inversely proportional to the number of
      // unique nested structures.
      if (aStack[length] == a) return bStack[length] == b;
    }
    // Objects with different constructors are not equivalent, but `Object`s
    // from different frames are.
    var aCtor = a.constructor, bCtor = b.constructor;
    if (aCtor !== bCtor && !(_.isFunction(aCtor) && (aCtor instanceof aCtor) &&
                             _.isFunction(bCtor) && (bCtor instanceof bCtor))
                        && ('constructor' in a && 'constructor' in b)) {
      return false;
    }
    // Add the first object to the stack of traversed objects.
    aStack.push(a);
    bStack.push(b);
    var size = 0, result = true;
    // Recursively compare objects and arrays.
    if (className == '[object Array]') {
      // Compare array lengths to determine if a deep comparison is necessary.
      size = a.length;
      result = size == b.length;
      if (result) {
        // Deep compare the contents, ignoring non-numeric properties.
        while (size--) {
          if (!(result = eq(a[size], b[size], aStack, bStack))) break;
        }
      }
    } else {
      // Deep compare objects.
      for (var key in a) {
        if (_.has(a, key)) {
          // Count the expected number of properties.
          size++;
          // Deep compare each member.
          if (!(result = _.has(b, key) && eq(a[key], b[key], aStack, bStack))) break;
        }
      }
      // Ensure that both objects contain the same number of properties.
      if (result) {
        for (key in b) {
          if (_.has(b, key) && !(size--)) break;
        }
        result = !size;
      }
    }
    // Remove the first object from the stack of traversed objects.
    aStack.pop();
    bStack.pop();
    return result;
  };

  // Perform a deep comparison to check if two objects are equal.
  _.isEqual = function(a, b) {
    return eq(a, b, [], []);
  };

  // Is a given array, string, or object empty?
  // An "empty" object has no enumerable own-properties.
  _.isEmpty = function(obj) {
    if (obj == null) return true;
    if (_.isArray(obj) || _.isString(obj)) return obj.length === 0;
    for (var key in obj) if (_.has(obj, key)) return false;
    return true;
  };

  // Is a given value a DOM element?
  _.isElement = function(obj) {
    return !!(obj && obj.nodeType === 1);
  };

  // Is a given value an array?
  // Delegates to ECMA5's native Array.isArray
  _.isArray = nativeIsArray || function(obj) {
    return toString.call(obj) == '[object Array]';
  };

  // Is a given variable an object?
  _.isObject = function(obj) {
    return obj === Object(obj);
  };

  // Add some isType methods: isArguments, isFunction, isString, isNumber, isDate, isRegExp.
  each(['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp'], function(name) {
    _['is' + name] = function(obj) {
      return toString.call(obj) == '[object ' + name + ']';
    };
  });

  // Define a fallback version of the method in browsers (ahem, IE), where
  // there isn't any inspectable "Arguments" type.
  if (!_.isArguments(arguments)) {
    _.isArguments = function(obj) {
      return !!(obj && _.has(obj, 'callee'));
    };
  }

  // Optimize `isFunction` if appropriate.
  if (typeof (/./) !== 'function') {
    _.isFunction = function(obj) {
      return typeof obj === 'function';
    };
  }

  // Is a given object a finite number?
  _.isFinite = function(obj) {
    return isFinite(obj) && !isNaN(parseFloat(obj));
  };

  // Is the given value `NaN`? (NaN is the only number which does not equal itself).
  _.isNaN = function(obj) {
    return _.isNumber(obj) && obj != +obj;
  };

  // Is a given value a boolean?
  _.isBoolean = function(obj) {
    return obj === true || obj === false || toString.call(obj) == '[object Boolean]';
  };

  // Is a given value equal to null?
  _.isNull = function(obj) {
    return obj === null;
  };

  // Is a given variable undefined?
  _.isUndefined = function(obj) {
    return obj === void 0;
  };

  // Shortcut function for checking if an object has a given property directly
  // on itself (in other words, not on a prototype).
  _.has = function(obj, key) {
    return hasOwnProperty.call(obj, key);
  };

  // Utility Functions
  // -----------------

  // Run Underscore.js in *noConflict* mode, returning the `_` variable to its
  // previous owner. Returns a reference to the Underscore object.
  _.noConflict = function() {
    root._ = previousUnderscore;
    return this;
  };

  // Keep the identity function around for default iterators.
  _.identity = function(value) {
    return value;
  };

  _.constant = function(value) {
    return function () {
      return value;
    };
  };

  _.property = function(key) {
    return function(obj) {
      return obj[key];
    };
  };

  // Returns a predicate for checking whether an object has a given set of `key:value` pairs.
  _.matches = function(attrs) {
    return function(obj) {
      if (obj === attrs) return true; //avoid comparing an object to itself.
      for (var key in attrs) {
        if (attrs[key] !== obj[key])
          return false;
      }
      return true;
    }
  };

  // Run a function **n** times.
  _.times = function(n, iterator, context) {
    var accum = Array(Math.max(0, n));
    for (var i = 0; i < n; i++) accum[i] = iterator.call(context, i);
    return accum;
  };

  // Return a random integer between min and max (inclusive).
  _.random = function(min, max) {
    if (max == null) {
      max = min;
      min = 0;
    }
    return min + Math.floor(Math.random() * (max - min + 1));
  };

  // A (possibly faster) way to get the current timestamp as an integer.
  _.now = Date.now || function() { return new Date().getTime(); };

  // List of HTML entities for escaping.
  var entityMap = {
    escape: {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#x27;'
    }
  };
  entityMap.unescape = _.invert(entityMap.escape);

  // Regexes containing the keys and values listed immediately above.
  var entityRegexes = {
    escape:   new RegExp('[' + _.keys(entityMap.escape).join('') + ']', 'g'),
    unescape: new RegExp('(' + _.keys(entityMap.unescape).join('|') + ')', 'g')
  };

  // Functions for escaping and unescaping strings to/from HTML interpolation.
  _.each(['escape', 'unescape'], function(method) {
    _[method] = function(string) {
      if (string == null) return '';
      return ('' + string).replace(entityRegexes[method], function(match) {
        return entityMap[method][match];
      });
    };
  });

  // If the value of the named `property` is a function then invoke it with the
  // `object` as context; otherwise, return it.
  _.result = function(object, property) {
    if (object == null) return void 0;
    var value = object[property];
    return _.isFunction(value) ? value.call(object) : value;
  };

  // Add your own custom functions to the Underscore object.
  _.mixin = function(obj) {
    each(_.functions(obj), function(name) {
      var func = _[name] = obj[name];
      _.prototype[name] = function() {
        var args = [this._wrapped];
        push.apply(args, arguments);
        return result.call(this, func.apply(_, args));
      };
    });
  };

  // Generate a unique integer id (unique within the entire client session).
  // Useful for temporary DOM ids.
  var idCounter = 0;
  _.uniqueId = function(prefix) {
    var id = ++idCounter + '';
    return prefix ? prefix + id : id;
  };

  // By default, Underscore uses ERB-style template delimiters, change the
  // following template settings to use alternative delimiters.
  _.templateSettings = {
    evaluate    : /<%([\s\S]+?)%>/g,
    interpolate : /<%=([\s\S]+?)%>/g,
    escape      : /<%-([\s\S]+?)%>/g
  };

  // When customizing `templateSettings`, if you don't want to define an
  // interpolation, evaluation or escaping regex, we need one that is
  // guaranteed not to match.
  var noMatch = /(.)^/;

  // Certain characters need to be escaped so that they can be put into a
  // string literal.
  var escapes = {
    "'":      "'",
    '\\':     '\\',
    '\r':     'r',
    '\n':     'n',
    '\t':     't',
    '\u2028': 'u2028',
    '\u2029': 'u2029'
  };

  var escaper = /\\|'|\r|\n|\t|\u2028|\u2029/g;

  // JavaScript micro-templating, similar to John Resig's implementation.
  // Underscore templating handles arbitrary delimiters, preserves whitespace,
  // and correctly escapes quotes within interpolated code.
  _.template = function(text, data, settings) {
    var render;
    settings = _.defaults({}, settings, _.templateSettings);

    // Combine delimiters into one regular expression via alternation.
    var matcher = new RegExp([
      (settings.escape || noMatch).source,
      (settings.interpolate || noMatch).source,
      (settings.evaluate || noMatch).source
    ].join('|') + '|$', 'g');

    // Compile the template source, escaping string literals appropriately.
    var index = 0;
    var source = "__p+='";
    text.replace(matcher, function(match, escape, interpolate, evaluate, offset) {
      source += text.slice(index, offset)
        .replace(escaper, function(match) { return '\\' + escapes[match]; });

      if (escape) {
        source += "'+\n((__t=(" + escape + "))==null?'':_.escape(__t))+\n'";
      }
      if (interpolate) {
        source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
      }
      if (evaluate) {
        source += "';\n" + evaluate + "\n__p+='";
      }
      index = offset + match.length;
      return match;
    });
    source += "';\n";

    // If a variable is not specified, place data values in local scope.
    if (!settings.variable) source = 'with(obj||{}){\n' + source + '}\n';

    source = "var __t,__p='',__j=Array.prototype.join," +
      "print=function(){__p+=__j.call(arguments,'');};\n" +
      source + "return __p;\n";

    try {
      render = new Function(settings.variable || 'obj', '_', source);
    } catch (e) {
      e.source = source;
      throw e;
    }

    if (data) return render(data, _);
    var template = function(data) {
      return render.call(this, data, _);
    };

    // Provide the compiled function source as a convenience for precompilation.
    template.source = 'function(' + (settings.variable || 'obj') + '){\n' + source + '}';

    return template;
  };

  // Add a "chain" function, which will delegate to the wrapper.
  _.chain = function(obj) {
    return _(obj).chain();
  };

  // OOP
  // ---------------
  // If Underscore is called as a function, it returns a wrapped object that
  // can be used OO-style. This wrapper holds altered versions of all the
  // underscore functions. Wrapped objects may be chained.

  // Helper function to continue chaining intermediate results.
  var result = function(obj) {
    return this._chain ? _(obj).chain() : obj;
  };

  // Add all of the Underscore functions to the wrapper object.
  _.mixin(_);

  // Add all mutator Array functions to the wrapper.
  each(['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'], function(name) {
    var method = ArrayProto[name];
    _.prototype[name] = function() {
      var obj = this._wrapped;
      method.apply(obj, arguments);
      if ((name == 'shift' || name == 'splice') && obj.length === 0) delete obj[0];
      return result.call(this, obj);
    };
  });

  // Add all accessor Array functions to the wrapper.
  each(['concat', 'join', 'slice'], function(name) {
    var method = ArrayProto[name];
    _.prototype[name] = function() {
      return result.call(this, method.apply(this._wrapped, arguments));
    };
  });

  _.extend(_.prototype, {

    // Start chaining a wrapped Underscore object.
    chain: function() {
      this._chain = true;
      return this;
    },

    // Extracts the result from a wrapped and chained object.
    value: function() {
      return this._wrapped;
    }

  });

  // AMD registration happens at the end for compatibility with AMD loaders
  // that may not enforce next-turn semantics on modules. Even though general
  // practice for AMD registration is to be anonymous, underscore registers
  // as a named module because, like jQuery, it is a base library that is
  // popular enough to be bundled in a third party lib, but not be part of
  // an AMD load request. Those cases could generate an error when an
  // anonymous define() is called outside of a loader request.
  if (typeof define === 'function' && define.amd) {
    define('underscore', [], function() {
      return _;
    });
  }
}).call(this);
})
},{"tribe/client/enhancedDebug":97}],88:[function(require,module,exports){
require("tribe/client/enhancedDebug").execute("var random = require('utilities/random');\n\nmodule.exports = {\n    range: range,\n    value: value,\n    property: property\n};\n\nfunction property (name, value) {\n    var result = createGenerator(value);\n\n    result.range = createGeneratorFactory('range');\n    result.value = createGeneratorFactory('value');\n\n    function createGeneratorFactory(name) {\n        return function () {\n            return createGenerator(module.exports[name].apply(null, arguments));\n        };\n    }\n\n    function createGenerator(generator) {\n        return function () {\n            var result = {};\n            result[name] = generator();\n            return result;\n        };\n    }\n\n    return result;\n}\n\nfunction range (min, max) {\n    return function () {\n        return random.range(min, max);\n    };\n}\n\nfunction value (value) {\n    return function () {\n        return value;\n    };\n}\n//@ sourceURL=http://app/node_modules/utilities/generate.js\n", arguments, window, require, module, exports);
(function () {var random = require('utilities/random');

module.exports = {
    range: range,
    value: value,
    property: property
};

function property (name, value) {
    var result = createGenerator(value);

    result.range = createGeneratorFactory('range');
    result.value = createGeneratorFactory('value');

    function createGeneratorFactory(name) {
        return function () {
            return createGenerator(module.exports[name].apply(null, arguments));
        };
    }

    function createGenerator(generator) {
        return function () {
            var result = {};
            result[name] = generator();
            return result;
        };
    }

    return result;
}

function range (min, max) {
    return function () {
        return random.range(min, max);
    };
}

function value (value) {
    return function () {
        return value;
    };
}})
},{"tribe/client/enhancedDebug":97,"utilities/random":95}],89:[function(require,module,exports){
require("tribe/client/enhancedDebug").execute("var towards = require('./location.towards'),\n    path = require('./location.path');\n\nmodule.exports = {\n    distance: function (from, to) {\n        var height = from.row - to.row,\n            width = from.col - to.col;\n        return Math.sqrt(height * height + width * width);\n    },\n    direction: function (direction, location) {\n        var targetLocation = { row: location.row, col: location.col };\n        switch(direction) {\n            case 'n':\n                targetLocation.row--;\n                break;\n            case 's':\n                targetLocation.row++;\n                break;\n            case 'w':\n                targetLocation.col--;\n                break;\n            case 'e':\n                targetLocation.col++;\n                break;\n            case 'nw':\n                targetLocation.row--;\n                targetLocation.col--;\n                break;\n            case 'ne':\n                targetLocation.row--;\n                targetLocation.col++;\n                break;\n            case 'sw':\n                targetLocation.row++;\n                targetLocation.col--;\n                break;\n            case 'se':\n                targetLocation.row++;\n                targetLocation.col++;\n                break;\n        }\n        return targetLocation;\n    },\n    towards: towards.towards,\n    moveTowards: towards.moveTowards,\n    path: path\n};\n//@ sourceURL=http://app/node_modules/utilities/location.js\n", arguments, window, require, module, exports);
(function () {var towards = require('./location.towards'),
    path = require('./location.path');

module.exports = {
    distance: function (from, to) {
        var height = from.row - to.row,
            width = from.col - to.col;
        return Math.sqrt(height * height + width * width);
    },
    direction: function (direction, location) {
        var targetLocation = { row: location.row, col: location.col };
        switch(direction) {
            case 'n':
                targetLocation.row--;
                break;
            case 's':
                targetLocation.row++;
                break;
            case 'w':
                targetLocation.col--;
                break;
            case 'e':
                targetLocation.col++;
                break;
            case 'nw':
                targetLocation.row--;
                targetLocation.col--;
                break;
            case 'ne':
                targetLocation.row--;
                targetLocation.col++;
                break;
            case 'sw':
                targetLocation.row++;
                targetLocation.col--;
                break;
            case 'se':
                targetLocation.row++;
                targetLocation.col++;
                break;
        }
        return targetLocation;
    },
    towards: towards.towards,
    moveTowards: towards.moveTowards,
    path: path
};})
},{"./location.path":91,"./location.towards":92,"tribe/client/enhancedDebug":97}],90:[function(require,module,exports){
require("tribe/client/enhancedDebug").execute("var _ = require('underscore');\n\nmodule.exports = {\n    path: getPath,\n    beam: getBeam\n};\n\nfunction getPath(start, angle) {\n    // this is a copy of the (start, end) version. It's not very efficient, but it works.\n\n    // the \"direction\" we are heading in\n    var rowIncrement = (angle + Math.PI * 2) % (Math.PI * 2) > Math.PI ? -1 : 1,\n        colIncrement = (angle + Math.PI * 2.5) % (Math.PI * 2) > Math.PI ? -1 : 1,\n\n        heightPerCol = Math.tan(angle) * colIncrement,\n        widthPerRow = 1 / Math.tan(angle) * rowIncrement,\n\n        current = start;\n\n    return {\n        next: function () {\n            // try a step in each direction towards the target, only one will be on the path\n            // I'm sure there is a proof for this, but I couldn't be bothered to find it\n            current = _.find([\n                { row: current.row + rowIncrement, col: current.col + colIncrement },\n                { row: current.row + rowIncrement, col: current.col },\n                { row: current.row, col: current.col + colIncrement }\n            ], isOnPath);\n\n            return current;\n        }\n    };\n\n    function isOnPath(location) {\n        var rows = Math.abs(start.row - location.row),\n            cols = Math.abs(start.col - location.col),\n            row = start.row + (heightPerCol * cols),\n            col = start.col + (widthPerRow * rows);\n\n        return withinBounds(location.row, row) || withinBounds(location.col, col);\n    }\n\n    function withinBounds(value, boundedValue) {\n        return value >= boundedValue - 0.5 && value <= boundedValue + 0.5;\n    }\n}\n\nfunction getBeam(start, angle) {\n    var path = getPath(start, angle),\n        rows = {};\n\n    return {\n        next: function () {\n            var center = path.next(),\n                nextCells = [];\n\n            testCell(center.row - 1, center.col - 1);\n            testCell(center.row - 1, center.col);\n            testCell(center.row - 1, center.col + 1);\n            testCell(center.row, center.col - 1);\n            testCell(center.row, center.col);\n            testCell(center.row, center.col + 1);\n            testCell(center.row + 1, center.col - 1);\n            testCell(center.row + 1, center.col);\n            testCell(center.row + 1, center.col + 1);\n\n            return nextCells;\n\n            function testCell(row, col) {\n                if (!rows[row]) {\n                    rows[row] = {};\n                    rows[row][col] = true;\n                    nextCells.push({ row: row, col: col });\n                } else {\n                    if (!rows[row][col]) {\n                        rows[row][col] = true;\n                        nextCells.push({ row: row, col: col });\n                    }\n                }\n            }\n        }\n    }\n}\n//@ sourceURL=http://app/node_modules/utilities/location.path.angle.js\n", arguments, window, require, module, exports);
(function () {var _ = require('underscore');

module.exports = {
    path: getPath,
    beam: getBeam
};

function getPath(start, angle) {
    // this is a copy of the (start, end) version. It's not very efficient, but it works.

    // the "direction" we are heading in
    var rowIncrement = (angle + Math.PI * 2) % (Math.PI * 2) > Math.PI ? -1 : 1,
        colIncrement = (angle + Math.PI * 2.5) % (Math.PI * 2) > Math.PI ? -1 : 1,

        heightPerCol = Math.tan(angle) * colIncrement,
        widthPerRow = 1 / Math.tan(angle) * rowIncrement,

        current = start;

    return {
        next: function () {
            // try a step in each direction towards the target, only one will be on the path
            // I'm sure there is a proof for this, but I couldn't be bothered to find it
            current = _.find([
                { row: current.row + rowIncrement, col: current.col + colIncrement },
                { row: current.row + rowIncrement, col: current.col },
                { row: current.row, col: current.col + colIncrement }
            ], isOnPath);

            return current;
        }
    };

    function isOnPath(location) {
        var rows = Math.abs(start.row - location.row),
            cols = Math.abs(start.col - location.col),
            row = start.row + (heightPerCol * cols),
            col = start.col + (widthPerRow * rows);

        return withinBounds(location.row, row) || withinBounds(location.col, col);
    }

    function withinBounds(value, boundedValue) {
        return value >= boundedValue - 0.5 && value <= boundedValue + 0.5;
    }
}

function getBeam(start, angle) {
    var path = getPath(start, angle),
        rows = {};

    return {
        next: function () {
            var center = path.next(),
                nextCells = [];

            testCell(center.row - 1, center.col - 1);
            testCell(center.row - 1, center.col);
            testCell(center.row - 1, center.col + 1);
            testCell(center.row, center.col - 1);
            testCell(center.row, center.col);
            testCell(center.row, center.col + 1);
            testCell(center.row + 1, center.col - 1);
            testCell(center.row + 1, center.col);
            testCell(center.row + 1, center.col + 1);

            return nextCells;

            function testCell(row, col) {
                if (!rows[row]) {
                    rows[row] = {};
                    rows[row][col] = true;
                    nextCells.push({ row: row, col: col });
                } else {
                    if (!rows[row][col]) {
                        rows[row][col] = true;
                        nextCells.push({ row: row, col: col });
                    }
                }
            }
        }
    }
}})
},{"tribe/client/enhancedDebug":97,"underscore":87}],91:[function(require,module,exports){
require("tribe/client/enhancedDebug").execute("var angle = require('./location.path.angle'),\n    _ = require('underscore');\n\nmodule.exports = function (start, end) {\n    var colCount = Math.abs(start.col - end.col),\n        rowCount = Math.abs(start.row - end.row),\n\n        heightPerCol = (end.row - start.row) / colCount,\n        widthPerRow = (end.col - start.col) / rowCount,\n\n        // the \"direction\" we are heading in\n        rowIncrement = start.row < end.row ? 1 : -1,\n        colIncrement = start.col < end.col ? 1 : -1,\n\n        results = [],\n        current = start;\n\n    return {\n        all: function () {\n            var results = [], location;\n            while (location = this.next())\n                results.push(location);\n            return results;\n        },\n        next: function () {\n            if (current.row === end.row && current.col === end.col)\n                return null;\n\n            // try a step in each direction towards the target, only one will be on the path\n            // I'm sure there is a proof for this, but I couldn't be bothered to find it\n            current = _.find([\n                { row: current.row + rowIncrement, col: current.col + colIncrement },\n                { row: current.row + rowIncrement, col: current.col },\n                { row: current.row, col: current.col + colIncrement }\n            ], isOnPath);\n\n            return current;\n        }\n    };\n\n    function isOnPath(location) {\n        var rows = Math.abs(start.row - location.row),\n            cols = Math.abs(start.col - location.col),\n            row = start.row + (heightPerCol * cols),\n            col = start.col + (widthPerRow * rows);\n\n        return withinBounds(location.row, row) || withinBounds(location.col, col);\n    }\n\n    function withinBounds(value, boundedValue) {\n        return value >= boundedValue - 0.5 && value <= boundedValue + 0.5;\n    }\n}\n\nmodule.exports.angle = angle.path;\nmodule.exports.beam = angle.beam;\n\n\n//@ sourceURL=http://app/node_modules/utilities/location.path.js\n", arguments, window, require, module, exports);
(function () {var angle = require('./location.path.angle'),
    _ = require('underscore');

module.exports = function (start, end) {
    var colCount = Math.abs(start.col - end.col),
        rowCount = Math.abs(start.row - end.row),

        heightPerCol = (end.row - start.row) / colCount,
        widthPerRow = (end.col - start.col) / rowCount,

        // the "direction" we are heading in
        rowIncrement = start.row < end.row ? 1 : -1,
        colIncrement = start.col < end.col ? 1 : -1,

        results = [],
        current = start;

    return {
        all: function () {
            var results = [], location;
            while (location = this.next())
                results.push(location);
            return results;
        },
        next: function () {
            if (current.row === end.row && current.col === end.col)
                return null;

            // try a step in each direction towards the target, only one will be on the path
            // I'm sure there is a proof for this, but I couldn't be bothered to find it
            current = _.find([
                { row: current.row + rowIncrement, col: current.col + colIncrement },
                { row: current.row + rowIncrement, col: current.col },
                { row: current.row, col: current.col + colIncrement }
            ], isOnPath);

            return current;
        }
    };

    function isOnPath(location) {
        var rows = Math.abs(start.row - location.row),
            cols = Math.abs(start.col - location.col),
            row = start.row + (heightPerCol * cols),
            col = start.col + (widthPerRow * rows);

        return withinBounds(location.row, row) || withinBounds(location.col, col);
    }

    function withinBounds(value, boundedValue) {
        return value >= boundedValue - 0.5 && value <= boundedValue + 0.5;
    }
}

module.exports.angle = angle.path;
module.exports.beam = angle.beam;

})
},{"./location.path.angle":90,"tribe/client/enhancedDebug":97,"underscore":87}],92:[function(require,module,exports){
require("tribe/client/enhancedDebug").execute("var interactions = require('interactions'),\n    _ = require('underscore');\n\nmodule.exports = {\n    towards: function (from, to) {\n        var height = to.row - from.row,\n            width = to.col - from.col,\n            newLocation = { row: from.row, col: from.col };\n\n        if(height === 0 && width === 0)\n            return newLocation;\n        \n        if(height > 0) ++newLocation.row;\n        if(height < 0) --newLocation.row;\n        if(width > 0) ++newLocation.col;\n        if(width < 0) --newLocation.col;\n\n        return newLocation;\n    },\n    moveTowards: function (object, to, map) {\n        var from = object.location(),\n            row = from.row,\n            col = from.col,\n            height = to.row - from.row,\n            width = to.col - from.col;\n\n        if(height === 0 && width === 0) return { row: row, col: col };\n\n        // there is a much neater and more efficient way of determining this. I just can't be bothered to figure it out right now.\n        else if(height < 0 && width < 0) return findLocation([{ row: row - 1, col: col - 1 }, { row: row, col: col - 1 }, { row: row - 1, col: col }]);\n        else if(height < 0 && width === 0) return findLocation([{ row: row - 1, col: col }, { row: row - 1, col: col - 1 }, { row: row - 1, col: col + 1 }]);\n        else if(height < 0 && width > 0) return findLocation([{ row: row - 1, col: col + 1 }, { row: row - 1, col: col }, { row: row, col: col + 1 }]);\n        else if(height === 0 && width > 0) return findLocation([{ row: row, col: col + 1 }, { row: row - 1, col: col + 1 }, { row: row + 1, col: col + 1 }]);\n        else if(height > 0 && width > 0) return findLocation([{ row: row + 1, col: col + 1 }, { row: row, col: col + 1 }, { row: row + 1, col: col }]);\n        else if(height > 0 && width === 0) return findLocation([{ row: row + 1, col: col }, { row: row + 1, col: col + 1 }, { row: row + 1, col: col - 1 }]);\n        else if(height > 0 && width < 0) return findLocation([{ row: row + 1, col: col - 1 }, { row: row + 1, col: col }, { row: row, col: col - 1 }]);\n        else if(height === 0 && width < 0) return findLocation([{ row: row, col: col - 1 }, { row: row + 1, col: col - 1 }, { row: row - 1, col: col - 1 }]);\n\n        function findLocation(locations) {\n            return _.find(locations, canOccupy);\n        }\n\n        function canOccupy(location) {\n            var outcomes = interactions.outcomesFor('move', object, map.tile(location).objects()),\n                occupy = _.findWhere(outcomes, { name: 'occupy' });\n            return occupy !== undefined && occupy !== false;\n        }\n\n    }\n};\n//@ sourceURL=http://app/node_modules/utilities/location.towards.js\n", arguments, window, require, module, exports);
(function () {var interactions = require('interactions'),
    _ = require('underscore');

module.exports = {
    towards: function (from, to) {
        var height = to.row - from.row,
            width = to.col - from.col,
            newLocation = { row: from.row, col: from.col };

        if(height === 0 && width === 0)
            return newLocation;
        
        if(height > 0) ++newLocation.row;
        if(height < 0) --newLocation.row;
        if(width > 0) ++newLocation.col;
        if(width < 0) --newLocation.col;

        return newLocation;
    },
    moveTowards: function (object, to, map) {
        var from = object.location(),
            row = from.row,
            col = from.col,
            height = to.row - from.row,
            width = to.col - from.col;

        if(height === 0 && width === 0) return { row: row, col: col };

        // there is a much neater and more efficient way of determining this. I just can't be bothered to figure it out right now.
        else if(height < 0 && width < 0) return findLocation([{ row: row - 1, col: col - 1 }, { row: row, col: col - 1 }, { row: row - 1, col: col }]);
        else if(height < 0 && width === 0) return findLocation([{ row: row - 1, col: col }, { row: row - 1, col: col - 1 }, { row: row - 1, col: col + 1 }]);
        else if(height < 0 && width > 0) return findLocation([{ row: row - 1, col: col + 1 }, { row: row - 1, col: col }, { row: row, col: col + 1 }]);
        else if(height === 0 && width > 0) return findLocation([{ row: row, col: col + 1 }, { row: row - 1, col: col + 1 }, { row: row + 1, col: col + 1 }]);
        else if(height > 0 && width > 0) return findLocation([{ row: row + 1, col: col + 1 }, { row: row, col: col + 1 }, { row: row + 1, col: col }]);
        else if(height > 0 && width === 0) return findLocation([{ row: row + 1, col: col }, { row: row + 1, col: col + 1 }, { row: row + 1, col: col - 1 }]);
        else if(height > 0 && width < 0) return findLocation([{ row: row + 1, col: col - 1 }, { row: row + 1, col: col }, { row: row, col: col - 1 }]);
        else if(height === 0 && width < 0) return findLocation([{ row: row, col: col - 1 }, { row: row + 1, col: col - 1 }, { row: row - 1, col: col - 1 }]);

        function findLocation(locations) {
            return _.find(locations, canOccupy);
        }

        function canOccupy(location) {
            var outcomes = interactions.outcomesFor('move', object, map.tile(location).objects()),
                occupy = _.findWhere(outcomes, { name: 'occupy' });
            return occupy !== undefined && occupy !== false;
        }

    }
};})
},{"interactions":46,"tribe/client/enhancedDebug":97,"underscore":87}],93:[function(require,module,exports){
require("tribe/client/enhancedDebug").execute("module.exports = {\n    merge: function (target, source) {\n        target = target || {};\n\n        for (var property in source) {\n            if (source.hasOwnProperty(property)) {\n                var value = source[property];\n                if (value === null)\n                    target[property] = null;\n                else if (value !== undefined) {\n                    switch (value.constructor) {\n                        case Array: target[property] = target[property] ? value.concat(target[property]) : value; break;\n                        case Object: target[property] = module.exports.merge(target[property], value); break;\n                        default: target[property] = value;\n                    }\n                }\n            }\n        }\n        return target;\n    },\n    makeObservable: function (object) {\n        for (var property in object)\n            if (object.hasOwnProperty(property) && !ko.isObservable(object[property]))\n                object[property] = ko.observable(object[property]);\n    }\n}\n\n//@ sourceURL=http://app/node_modules/utilities/objects.js\n", arguments, window, require, module, exports);
(function () {module.exports = {
    merge: function (target, source) {
        target = target || {};

        for (var property in source) {
            if (source.hasOwnProperty(property)) {
                var value = source[property];
                if (value === null)
                    target[property] = null;
                else if (value !== undefined) {
                    switch (value.constructor) {
                        case Array: target[property] = target[property] ? value.concat(target[property]) : value; break;
                        case Object: target[property] = module.exports.merge(target[property], value); break;
                        default: target[property] = value;
                    }
                }
            }
        }
        return target;
    },
    makeObservable: function (object) {
        for (var property in object)
            if (object.hasOwnProperty(property) && !ko.isObservable(object[property]))
                object[property] = ko.observable(object[property]);
    }
}
})
},{"tribe/client/enhancedDebug":97}],94:[function(require,module,exports){
require("tribe/client/enhancedDebug").execute("module.exports = {\n    getElementOctant: function (element, pageX, pageY) {\n        element = $(element);\n        var height = element.height(),\n            width = element.width(),\n            offset = element.offset(),\n            x = pageX - offset.left,\n            y = pageY - offset.top;\n\n        return this.getRectangleOctant(width, height, x, y);\n    },\n\n    // only works for height > width...\n    getRectangleOctant: function (width, height, x, y) {\n        var start = (height - width) / 2,\n            end = height - start;\n\n        // we will only apply our octant to a box in the centre of the screen\n        // for above and below, divide into three regions\n        if (y < start)\n            return (Math.floor(x / (width / 3)) + 7) % 8;\n\n        if (y > end)\n            return 5 - Math.floor(x / (width / 3));\n\n        // this DOES work with height < width...\n        // adjust our x and y to be relative to the center of the screen\n        return this.getOctant(x - width / 2, y - height / 2);\n    },\n\n    \n    getOctant: function (x, y) {\n        var baseAngle = Math.atan2(y, x) * 180 / Math.PI,\n            // x and y are screen coordinates, i.e. start in the second quadrant\n            // adjust back 90 degrees, plus first octant is 22.5 degrees either side of north\n            angle = (baseAngle + 360 + 112.5) % 360,\n\n            // we don't want exactly even octants, these are the angles\n            octantAngles = [45, 30, 75, 30, 45, 30, 75, 30],\n            octantAngle = 0;\n\n        for (var i = 0; i < 8; i++) {\n            octantAngle += octantAngles[i];\n            if (angle < octantAngle)\n                return i;\n        }\n    },\n\n    asDirection: function (octant) {\n        switch (octant) {\n            case 0: return 'n';\n            case 1: return 'ne';\n            case 2: return 'e';\n            case 3: return 'se';\n            case 4: return 's';\n            case 5: return 'sw';\n            case 6: return 'w';\n            case 7: return 'nw';\n        }\n    }\n};\n//@ sourceURL=http://app/node_modules/utilities/octant.js\n", arguments, window, require, module, exports);
(function () {module.exports = {
    getElementOctant: function (element, pageX, pageY) {
        element = $(element);
        var height = element.height(),
            width = element.width(),
            offset = element.offset(),
            x = pageX - offset.left,
            y = pageY - offset.top;

        return this.getRectangleOctant(width, height, x, y);
    },

    // only works for height > width...
    getRectangleOctant: function (width, height, x, y) {
        var start = (height - width) / 2,
            end = height - start;

        // we will only apply our octant to a box in the centre of the screen
        // for above and below, divide into three regions
        if (y < start)
            return (Math.floor(x / (width / 3)) + 7) % 8;

        if (y > end)
            return 5 - Math.floor(x / (width / 3));

        // this DOES work with height < width...
        // adjust our x and y to be relative to the center of the screen
        return this.getOctant(x - width / 2, y - height / 2);
    },

    
    getOctant: function (x, y) {
        var baseAngle = Math.atan2(y, x) * 180 / Math.PI,
            // x and y are screen coordinates, i.e. start in the second quadrant
            // adjust back 90 degrees, plus first octant is 22.5 degrees either side of north
            angle = (baseAngle + 360 + 112.5) % 360,

            // we don't want exactly even octants, these are the angles
            octantAngles = [45, 30, 75, 30, 45, 30, 75, 30],
            octantAngle = 0;

        for (var i = 0; i < 8; i++) {
            octantAngle += octantAngles[i];
            if (angle < octantAngle)
                return i;
        }
    },

    asDirection: function (octant) {
        switch (octant) {
            case 0: return 'n';
            case 1: return 'ne';
            case 2: return 'e';
            case 3: return 'se';
            case 4: return 's';
            case 5: return 'sw';
            case 6: return 'w';
            case 7: return 'nw';
        }
    }
};})
},{"tribe/client/enhancedDebug":97}],95:[function(require,module,exports){
require("tribe/client/enhancedDebug").execute("// intended to be stubbed out for unit tests to eliminate test flakiness\nmodule.exports = {\n    range: function (min, max) {\n        return min + Math.floor(Math.random() * (max - min + 1));\n    },\n    probability: function (probability) {\n        return Math.random() < probability;\n    }\n}\n//@ sourceURL=http://app/node_modules/utilities/random.js\n", arguments, window, require, module, exports);
(function () {// intended to be stubbed out for unit tests to eliminate test flakiness
module.exports = {
    range: function (min, max) {
        return min + Math.floor(Math.random() * (max - min + 1));
    },
    probability: function (probability) {
        return Math.random() < probability;
    }
}})
},{"tribe/client/enhancedDebug":97}],96:[function(require,module,exports){
require("tribe/client/enhancedDebug").execute("var Q = require('q');\n\nmodule.exports = function (delay, state) {\n    var q = Q.defer();\n\n    setTimeout(function() {\n        q.resolve(state);\n    }, delay);\n\n    return q.promise;\n};\n//@ sourceURL=http://app/node_modules/utilities/timeout.js\n", arguments, window, require, module, exports);
(function () {var Q = require('q');

module.exports = function (delay, state) {
    var q = Q.defer();

    setTimeout(function() {
        q.resolve(state);
    }, delay);

    return q.promise;
};})
},{"q":79,"tribe/client/enhancedDebug":97}],97:[function(require,module,exports){
// pure nasty hackiness... if the benefits weren't so sweet, I'd shoot myself for writing this.
module.exports = {
    execute: function (source, args, thisArg, require, module, exports) {
        var executeArgs = this.attachCalleeArguments(args, {
            require: require,
            module: module,
            exports: exports
        });

        var compiled = eval.call(thisArg, constructSource(source, executeArgs));
        return compiled.apply(thisArg, values(executeArgs));
    },
    argumentNames: function (func) {
        var argString = func.toString().match(/\(([^\)]*)\)/)[1];
        if (!argString) return [];
        return argString.split(',');
    },
    attachCalleeArguments: function (args, to) {
        var names = this.argumentNames(args.callee);
        for (var i = 0, l = names.length; i < l; i++)
            to[names[i]] = args[i];
        return to;
    }
};

function constructSource(source, args) {
    var pre = '(function(' + Object.keys(args).join(', ') + ') {\n';
    var post = '})';

    return pre + source + post;
}

function values(object) {
    var values = [];
    for (var property in object)
        if (object.hasOwnProperty(property))
            values.push(object[property]);
    return values;
}
},{}],98:[function(require,module,exports){
module.exports=require(23)
},{"tribe.pubsub":104,"tribe/client/enhancedDebug":97}],99:[function(require,module,exports){
require("tribe/client/enhancedDebug").execute("module.exports = {\n    actor: T.registerActor,\n    model: T.registerModel,\n    handler: function () {\n        throw new Error(\"You can't register a static handler on the client (yet)!\");\n    },\n    service: function () {\n        throw new Error(\"You can't register a service on the client!\");\n    }\n};\n//@ sourceURL=http://tribe//client/register.js\n", arguments, window, require, module, exports);
(function () {module.exports = {
    actor: T.registerActor,
    model: T.registerModel,
    handler: function () {
        throw new Error("You can't register a static handler on the client (yet)!");
    },
    service: function () {
        throw new Error("You can't register a service on the client!");
    }
};})
},{"tribe/client/enhancedDebug":97}],100:[function(require,module,exports){
require("tribe/client/enhancedDebug").execute("module.exports = function (name) {\n    return {\n        invoke: function () {\n            return $.get('/services', { name: name, args: Array.prototype.splice.call(arguments, 0) })\n                .fail(function (response) {\n                    T.logger.error(response.responseText);\n                });\n        }\n    };\n};\n//@ sourceURL=http://tribe//client/services.js\n", arguments, window, require, module, exports);
(function () {module.exports = function (name) {
    return {
        invoke: function () {
            return $.get('/services', { name: name, args: Array.prototype.splice.call(arguments, 0) })
                .fail(function (response) {
                    T.logger.error(response.responseText);
                });
        }
    };
};})
},{"tribe/client/enhancedDebug":97}],101:[function(require,module,exports){
require("tribe/client/enhancedDebug").execute("var level = 4;\nvar levels = {\n    debug: 4,\n    info: 3,\n    warn: 2,\n    error: 1,\n    none: 0\n};\n\nvar api = module.exports = {\n    setLevel: function (newLevel) {\n        level = levels[newLevel];\n        if (level === undefined) level = 4;\n    },\n    debug: function (message) {\n        if (level >= 4)\n            console.log(('DEBUG: ' + message));\n    },\n    info: function (message) {\n        if (level >= 3)\n            console.info(('INFO: ' + message));\n    },\n    warn: function (message) {\n        if (level >= 2)\n            console.warn(('WARN: ' + message));\n    },\n    error: function (message, error) {\n        if (level >= 1)\n            console.error(('ERROR: ' + message + '\\n'), api.errorDetails(error));\n    },\n    errorDetails: function (ex) {\n        if (!ex) return '';\n        return (ex.constructor === String) ? ex :\n            (ex.stack || '') + (ex.inner ? '\\n\\n' + this.errorDetails(ex.inner) : '\\n');\n    },\n    log: function (message, prefix) {\n        var match = message && message.toString().match(/([^:]*):/),\n            level = match && match[1].toLowerCase();\n\n        if (api[level])\n            api[level]((prefix ? prefix + ' ' : '') + message.substring(level.length + 2).replace(/\\r?\\n$/, ''));\n        else\n            console.log((prefix ? prefix + ' ' : '') + message);\n    }\n};\n\n//@ sourceURL=http://tribe//logger.js\n", arguments, window, require, module, exports);
(function () {var level = 4;
var levels = {
    debug: 4,
    info: 3,
    warn: 2,
    error: 1,
    none: 0
};

var api = module.exports = {
    setLevel: function (newLevel) {
        level = levels[newLevel];
        if (level === undefined) level = 4;
    },
    debug: function (message) {
        if (level >= 4)
            console.log(('DEBUG: ' + message));
    },
    info: function (message) {
        if (level >= 3)
            console.info(('INFO: ' + message));
    },
    warn: function (message) {
        if (level >= 2)
            console.warn(('WARN: ' + message));
    },
    error: function (message, error) {
        if (level >= 1)
            console.error(('ERROR: ' + message + '\n'), api.errorDetails(error));
    },
    errorDetails: function (ex) {
        if (!ex) return '';
        return (ex.constructor === String) ? ex :
            (ex.stack || '') + (ex.inner ? '\n\n' + this.errorDetails(ex.inner) : '\n');
    },
    log: function (message, prefix) {
        var match = message && message.toString().match(/([^:]*):/),
            level = match && match[1].toLowerCase();

        if (api[level])
            api[level]((prefix ? prefix + ' ' : '') + message.substring(level.length + 2).replace(/\r?\n$/, ''));
        else
            console.log((prefix ? prefix + ' ' : '') + message);
    }
};
})
},{"tribe/client/enhancedDebug":97}],102:[function(require,module,exports){
require("tribe/client/enhancedDebug").execute("var lookup = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';\n\n;(function (exports) {\n	'use strict';\n\n  var Arr = (typeof Uint8Array !== 'undefined')\n    ? Uint8Array\n    : Array\n\n	var ZERO   = '0'.charCodeAt(0)\n	var PLUS   = '+'.charCodeAt(0)\n	var SLASH  = '/'.charCodeAt(0)\n	var NUMBER = '0'.charCodeAt(0)\n	var LOWER  = 'a'.charCodeAt(0)\n	var UPPER  = 'A'.charCodeAt(0)\n\n	function decode (elt) {\n		var code = elt.charCodeAt(0)\n		if (code === PLUS)\n			return 62 // '+'\n		if (code === SLASH)\n			return 63 // '/'\n		if (code < NUMBER)\n			return -1 //no match\n		if (code < NUMBER + 10)\n			return code - NUMBER + 26 + 26\n		if (code < UPPER + 26)\n			return code - UPPER\n		if (code < LOWER + 26)\n			return code - LOWER + 26\n	}\n\n	function b64ToByteArray (b64) {\n		var i, j, l, tmp, placeHolders, arr\n\n		if (b64.length % 4 > 0) {\n			throw new Error('Invalid string. Length must be a multiple of 4')\n		}\n\n		// the number of equal signs (place holders)\n		// if there are two placeholders, than the two characters before it\n		// represent one byte\n		// if there is only one, then the three characters before it represent 2 bytes\n		// this is just a cheap hack to not do indexOf twice\n		var len = b64.length\n		placeHolders = '=' === b64.charAt(len - 2) ? 2 : '=' === b64.charAt(len - 1) ? 1 : 0\n\n		// base64 is 4/3 + up to two characters of the original data\n		arr = new Arr(b64.length * 3 / 4 - placeHolders)\n\n		// if there are placeholders, only get up to the last complete 4 chars\n		l = placeHolders > 0 ? b64.length - 4 : b64.length\n\n		var L = 0\n\n		function push (v) {\n			arr[L++] = v\n		}\n\n		for (i = 0, j = 0; i < l; i += 4, j += 3) {\n			tmp = (decode(b64.charAt(i)) << 18) | (decode(b64.charAt(i + 1)) << 12) | (decode(b64.charAt(i + 2)) << 6) | decode(b64.charAt(i + 3))\n			push((tmp & 0xFF0000) >> 16)\n			push((tmp & 0xFF00) >> 8)\n			push(tmp & 0xFF)\n		}\n\n		if (placeHolders === 2) {\n			tmp = (decode(b64.charAt(i)) << 2) | (decode(b64.charAt(i + 1)) >> 4)\n			push(tmp & 0xFF)\n		} else if (placeHolders === 1) {\n			tmp = (decode(b64.charAt(i)) << 10) | (decode(b64.charAt(i + 1)) << 4) | (decode(b64.charAt(i + 2)) >> 2)\n			push((tmp >> 8) & 0xFF)\n			push(tmp & 0xFF)\n		}\n\n		return arr\n	}\n\n	function uint8ToBase64 (uint8) {\n		var i,\n			extraBytes = uint8.length % 3, // if we have 1 byte left, pad 2 bytes\n			output = \"\",\n			temp, length\n\n		function encode (num) {\n			return lookup.charAt(num)\n		}\n\n		function tripletToBase64 (num) {\n			return encode(num >> 18 & 0x3F) + encode(num >> 12 & 0x3F) + encode(num >> 6 & 0x3F) + encode(num & 0x3F)\n		}\n\n		// go through the array every three bytes, we'll deal with trailing stuff later\n		for (i = 0, length = uint8.length - extraBytes; i < length; i += 3) {\n			temp = (uint8[i] << 16) + (uint8[i + 1] << 8) + (uint8[i + 2])\n			output += tripletToBase64(temp)\n		}\n\n		// pad the end with zeros, but make sure to not forget the extra bytes\n		switch (extraBytes) {\n			case 1:\n				temp = uint8[uint8.length - 1]\n				output += encode(temp >> 2)\n				output += encode((temp << 4) & 0x3F)\n				output += '=='\n				break\n			case 2:\n				temp = (uint8[uint8.length - 2] << 8) + (uint8[uint8.length - 1])\n				output += encode(temp >> 10)\n				output += encode((temp >> 4) & 0x3F)\n				output += encode((temp << 2) & 0x3F)\n				output += '='\n				break\n		}\n\n		return output\n	}\n\n	module.exports.toByteArray = b64ToByteArray\n	module.exports.fromByteArray = uint8ToBase64\n}())\n\n//@ sourceURL=http://tribe//node_modules/browserify/node_modules/buffer/node_modules/base64-js/lib/b64.js\n", arguments, window, require, module, exports);
(function () {var lookup = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

;(function (exports) {
	'use strict';

  var Arr = (typeof Uint8Array !== 'undefined')
    ? Uint8Array
    : Array

	var ZERO   = '0'.charCodeAt(0)
	var PLUS   = '+'.charCodeAt(0)
	var SLASH  = '/'.charCodeAt(0)
	var NUMBER = '0'.charCodeAt(0)
	var LOWER  = 'a'.charCodeAt(0)
	var UPPER  = 'A'.charCodeAt(0)

	function decode (elt) {
		var code = elt.charCodeAt(0)
		if (code === PLUS)
			return 62 // '+'
		if (code === SLASH)
			return 63 // '/'
		if (code < NUMBER)
			return -1 //no match
		if (code < NUMBER + 10)
			return code - NUMBER + 26 + 26
		if (code < UPPER + 26)
			return code - UPPER
		if (code < LOWER + 26)
			return code - LOWER + 26
	}

	function b64ToByteArray (b64) {
		var i, j, l, tmp, placeHolders, arr

		if (b64.length % 4 > 0) {
			throw new Error('Invalid string. Length must be a multiple of 4')
		}

		// the number of equal signs (place holders)
		// if there are two placeholders, than the two characters before it
		// represent one byte
		// if there is only one, then the three characters before it represent 2 bytes
		// this is just a cheap hack to not do indexOf twice
		var len = b64.length
		placeHolders = '=' === b64.charAt(len - 2) ? 2 : '=' === b64.charAt(len - 1) ? 1 : 0

		// base64 is 4/3 + up to two characters of the original data
		arr = new Arr(b64.length * 3 / 4 - placeHolders)

		// if there are placeholders, only get up to the last complete 4 chars
		l = placeHolders > 0 ? b64.length - 4 : b64.length

		var L = 0

		function push (v) {
			arr[L++] = v
		}

		for (i = 0, j = 0; i < l; i += 4, j += 3) {
			tmp = (decode(b64.charAt(i)) << 18) | (decode(b64.charAt(i + 1)) << 12) | (decode(b64.charAt(i + 2)) << 6) | decode(b64.charAt(i + 3))
			push((tmp & 0xFF0000) >> 16)
			push((tmp & 0xFF00) >> 8)
			push(tmp & 0xFF)
		}

		if (placeHolders === 2) {
			tmp = (decode(b64.charAt(i)) << 2) | (decode(b64.charAt(i + 1)) >> 4)
			push(tmp & 0xFF)
		} else if (placeHolders === 1) {
			tmp = (decode(b64.charAt(i)) << 10) | (decode(b64.charAt(i + 1)) << 4) | (decode(b64.charAt(i + 2)) >> 2)
			push((tmp >> 8) & 0xFF)
			push(tmp & 0xFF)
		}

		return arr
	}

	function uint8ToBase64 (uint8) {
		var i,
			extraBytes = uint8.length % 3, // if we have 1 byte left, pad 2 bytes
			output = "",
			temp, length

		function encode (num) {
			return lookup.charAt(num)
		}

		function tripletToBase64 (num) {
			return encode(num >> 18 & 0x3F) + encode(num >> 12 & 0x3F) + encode(num >> 6 & 0x3F) + encode(num & 0x3F)
		}

		// go through the array every three bytes, we'll deal with trailing stuff later
		for (i = 0, length = uint8.length - extraBytes; i < length; i += 3) {
			temp = (uint8[i] << 16) + (uint8[i + 1] << 8) + (uint8[i + 2])
			output += tripletToBase64(temp)
		}

		// pad the end with zeros, but make sure to not forget the extra bytes
		switch (extraBytes) {
			case 1:
				temp = uint8[uint8.length - 1]
				output += encode(temp >> 2)
				output += encode((temp << 4) & 0x3F)
				output += '=='
				break
			case 2:
				temp = (uint8[uint8.length - 2] << 8) + (uint8[uint8.length - 1])
				output += encode(temp >> 10)
				output += encode((temp >> 4) & 0x3F)
				output += encode((temp << 2) & 0x3F)
				output += '='
				break
		}

		return output
	}

	module.exports.toByteArray = b64ToByteArray
	module.exports.fromByteArray = uint8ToBase64
}())
})
},{"tribe/client/enhancedDebug":97}],103:[function(require,module,exports){
require("tribe/client/enhancedDebug").execute("exports.read = function(buffer, offset, isLE, mLen, nBytes) {\n  var e, m,\n      eLen = nBytes * 8 - mLen - 1,\n      eMax = (1 << eLen) - 1,\n      eBias = eMax >> 1,\n      nBits = -7,\n      i = isLE ? (nBytes - 1) : 0,\n      d = isLE ? -1 : 1,\n      s = buffer[offset + i];\n\n  i += d;\n\n  e = s & ((1 << (-nBits)) - 1);\n  s >>= (-nBits);\n  nBits += eLen;\n  for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8);\n\n  m = e & ((1 << (-nBits)) - 1);\n  e >>= (-nBits);\n  nBits += mLen;\n  for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8);\n\n  if (e === 0) {\n    e = 1 - eBias;\n  } else if (e === eMax) {\n    return m ? NaN : ((s ? -1 : 1) * Infinity);\n  } else {\n    m = m + Math.pow(2, mLen);\n    e = e - eBias;\n  }\n  return (s ? -1 : 1) * m * Math.pow(2, e - mLen);\n};\n\nexports.write = function(buffer, value, offset, isLE, mLen, nBytes) {\n  var e, m, c,\n      eLen = nBytes * 8 - mLen - 1,\n      eMax = (1 << eLen) - 1,\n      eBias = eMax >> 1,\n      rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0),\n      i = isLE ? 0 : (nBytes - 1),\n      d = isLE ? 1 : -1,\n      s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0;\n\n  value = Math.abs(value);\n\n  if (isNaN(value) || value === Infinity) {\n    m = isNaN(value) ? 1 : 0;\n    e = eMax;\n  } else {\n    e = Math.floor(Math.log(value) / Math.LN2);\n    if (value * (c = Math.pow(2, -e)) < 1) {\n      e--;\n      c *= 2;\n    }\n    if (e + eBias >= 1) {\n      value += rt / c;\n    } else {\n      value += rt * Math.pow(2, 1 - eBias);\n    }\n    if (value * c >= 2) {\n      e++;\n      c /= 2;\n    }\n\n    if (e + eBias >= eMax) {\n      m = 0;\n      e = eMax;\n    } else if (e + eBias >= 1) {\n      m = (value * c - 1) * Math.pow(2, mLen);\n      e = e + eBias;\n    } else {\n      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen);\n      e = 0;\n    }\n  }\n\n  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8);\n\n  e = (e << mLen) | m;\n  eLen += mLen;\n  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8);\n\n  buffer[offset + i - d] |= s * 128;\n};\n\n//@ sourceURL=http://tribe//node_modules/browserify/node_modules/buffer/node_modules/ieee754/index.js\n", arguments, window, require, module, exports);
(function () {exports.read = function(buffer, offset, isLE, mLen, nBytes) {
  var e, m,
      eLen = nBytes * 8 - mLen - 1,
      eMax = (1 << eLen) - 1,
      eBias = eMax >> 1,
      nBits = -7,
      i = isLE ? (nBytes - 1) : 0,
      d = isLE ? -1 : 1,
      s = buffer[offset + i];

  i += d;

  e = s & ((1 << (-nBits)) - 1);
  s >>= (-nBits);
  nBits += eLen;
  for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8);

  m = e & ((1 << (-nBits)) - 1);
  e >>= (-nBits);
  nBits += mLen;
  for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8);

  if (e === 0) {
    e = 1 - eBias;
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity);
  } else {
    m = m + Math.pow(2, mLen);
    e = e - eBias;
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen);
};

exports.write = function(buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c,
      eLen = nBytes * 8 - mLen - 1,
      eMax = (1 << eLen) - 1,
      eBias = eMax >> 1,
      rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0),
      i = isLE ? 0 : (nBytes - 1),
      d = isLE ? 1 : -1,
      s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0;

  value = Math.abs(value);

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0;
    e = eMax;
  } else {
    e = Math.floor(Math.log(value) / Math.LN2);
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--;
      c *= 2;
    }
    if (e + eBias >= 1) {
      value += rt / c;
    } else {
      value += rt * Math.pow(2, 1 - eBias);
    }
    if (value * c >= 2) {
      e++;
      c /= 2;
    }

    if (e + eBias >= eMax) {
      m = 0;
      e = eMax;
    } else if (e + eBias >= 1) {
      m = (value * c - 1) * Math.pow(2, mLen);
      e = e + eBias;
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen);
      e = 0;
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8);

  e = (e << mLen) | m;
  eLen += mLen;
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8);

  buffer[offset + i - d] |= s * 128;
};
})
},{"tribe/client/enhancedDebug":97}],104:[function(require,module,exports){
require("tribe/client/enhancedDebug").execute("\n// PubSub.js\n\nif (typeof (Tribe) === 'undefined')\n    Tribe = {};\n\nTribe.PubSub = function (options) {\n    var self = this;\n    var utils = Tribe.PubSub.utils;\n\n    this.owner = this;\n    this.options = options || {};\n    this.sync = option('sync');\n     \n    var subscribers = new Tribe.PubSub.SubscriberList();\n    this.subscribers = subscribers;\n\n    function publish(envelope) {\n        var messageSubscribers = subscribers.get(envelope.topic);\n        var sync = envelope.sync === true || self.sync === true;\n\n        for (var i = 0, l = messageSubscribers.length; i < l; i++) {\n            if (sync)\n                executeSubscriber(messageSubscribers[i].handler);\n            else {\n                (function (subscriber) {\n                    setTimeout(function () {\n                        executeSubscriber(subscriber.handler);\n                    });\n                })(messageSubscribers[i]);\n            }\n        }\n\n        function executeSubscriber(func) {\n            var exceptionHandler = option('exceptionHandler');\n            \n            if(option('handleExceptions')  && exceptionHandler)\n                try {\n                    func(envelope.data, envelope);\n                } catch (e) {\n                    exceptionHandler(e, envelope);\n                }\n            else\n                func(envelope.data, envelope);\n        }\n    }\n\n    this.publish = function (topicOrEnvelope, data) {\n        return publish(createEnvelope(topicOrEnvelope, data));\n    };\n\n    this.publishSync = function (topicOrEnvelope, data) {\n        var envelope = createEnvelope(topicOrEnvelope, data);\n        envelope.sync = true;\n        return publish(envelope);\n    };\n    \n    function createEnvelope(topicOrEnvelope, data) {\n        return topicOrEnvelope && topicOrEnvelope.topic\n            ? topicOrEnvelope\n            : { topic: topicOrEnvelope, data: data };\n    }\n\n    this.subscribe = function (topic, func) {\n        if (typeof (topic) === \"string\")\n            return subscribers.add(topic, func);\n        else if (utils.isArray(topic))\n            return utils.map(topic, function(topicName) {\n                return subscribers.add(topicName, func);\n            });\n        else\n            return utils.map(topic, function (individualFunc, topicName) {\n                return subscribers.add(topicName, individualFunc);\n            });\n    };\n\n    this.unsubscribe = function (tokens) {\n        if (Tribe.PubSub.utils.isArray(tokens)) {\n            var results = [];\n            for (var i = 0, l = tokens.length; i < l; i++)\n                results.push(subscribers.remove(tokens[i]));\n            return results;\n        }\n\n        return subscribers.remove(tokens);\n    };\n\n    this.createLifetime = function() {\n        return new Tribe.PubSub.Lifetime(self, self);\n    };\n\n    this.channel = function(channelId) {\n        return new Tribe.PubSub.Channel(self, channelId);\n    };\n    \n    function option(name) {\n        return (self.options.hasOwnProperty(name)) ? self.options[name] : Tribe.PubSub.options[name];\n    }\n};\n\n\n// Channel.js\n\nTribe.PubSub.Channel = function (pubsub, channelId) {\n    var self = this;\n    pubsub = pubsub.createLifetime();\n\n    this.id = channelId;\n    this.owner = pubsub.owner;\n\n    this.publish = function (topicOrEnvelope, data) {\n        return pubsub.publish(createEnvelope(topicOrEnvelope, data));\n    };\n\n    this.publishSync = function (topicOrEnvelope, data) {\n        return pubsub.publishSync(createEnvelope(topicOrEnvelope, data));\n    };\n\n    this.subscribe = function(topic, func) {\n        return pubsub.subscribe(topic, filterMessages(func));\n    };\n\n    this.subscribeOnce = function(topic, func) {\n        return pubsub.subscribeOnce(topic, filterMessages(func));\n    };\n    \n    this.unsubscribe = function(token) {\n        return pubsub.unsubscribe(token);\n    };\n\n    this.end = function() {\n        return pubsub.end();\n    };\n\n    this.createLifetime = function () {\n        return new Tribe.PubSub.Lifetime(self, self.owner);\n    };\n\n    function createEnvelope(topicOrEnvelope, data) {\n        var envelope = topicOrEnvelope && topicOrEnvelope.topic\n          ? topicOrEnvelope\n          : { topic: topicOrEnvelope, data: data };\n        envelope.channelId = channelId;\n        return envelope;\n    }\n    \n    function filterMessages(func) {\n        return function(data, envelope) {\n            if (envelope.channelId === channelId)\n                func(data, envelope);\n        };\n    }\n};\n\n\n// Lifetime.js\n\nTribe.PubSub.Lifetime = function (parent, owner) {\n    var self = this;\n    var tokens = [];\n\n    this.owner = owner;\n\n    this.publish = function(topicOrEnvelope, data) {\n        return parent.publish(topicOrEnvelope, data);\n    };\n\n    this.publishSync = function(topic, data) {\n        return parent.publishSync(topic, data);\n    };\n\n    this.subscribe = function(topic, func) {\n        var token = parent.subscribe(topic, func);\n        return recordToken(token);\n    };\n\n    this.subscribeOnce = function(topic, func) {\n        var token = parent.subscribeOnce(topic, func);\n        return recordToken(token);\n    };\n    \n    this.unsubscribe = function(token) {\n        // we should really remove the token(s) from our token list, but it has trivial impact if we don't\n        return parent.unsubscribe(token);\n    };\n\n    this.channel = function(channelId) {\n        return new Tribe.PubSub.Channel(self, channelId);\n    };\n\n    this.end = function() {\n        return parent.unsubscribe(tokens);\n    };\n\n    this.createLifetime = function() {\n        return new Tribe.PubSub.Lifetime(self, self.owner);\n    };\n    \n    function recordToken(token) {\n        if (Tribe.PubSub.utils.isArray(token))\n            tokens = tokens.concat(token);\n        else\n            tokens.push(token);\n        return token;\n    }\n};\n\n\n// options.js\n\nTribe.PubSub.options = {\n    sync: false,\n    handleExceptions: true,\n    exceptionHandler: function(e, envelope) {\n        typeof(console) !== 'undefined' && console.log(\"Exception occurred in subscriber to '\" + envelope.topic + \"': \" + Tribe.PubSub.utils.errorDetails(e));\n    }\n};\n\n\n// subscribeOnce.js\n\nTribe.PubSub.prototype.subscribeOnce = function (topic, handler) {\n    var self = this;\n    var utils = Tribe.PubSub.utils;\n    var lifetime = this.createLifetime();\n\n    if (typeof (topic) === \"string\")\n        return lifetime.subscribe(topic, wrapHandler(handler));\n    else if (utils.isArray(topic))\n        return lifetime.subscribe(wrapTopicArray());\n    else\n        return lifetime.subscribe(wrapTopicObject());\n\n    function wrapTopicArray() {\n        var result = {};\n        utils.each(topic, function(topicName) {\n            result[topicName] = wrapHandler(handler);\n        });\n        return result;\n    }\n    \n    function wrapTopicObject() {\n        return utils.map(topic, function (func, topicName) {\n            return lifetime.subscribe(topicName, wrapHandler(func));\n        });\n    }\n\n    function wrapHandler(func) {\n        return function() {\n            lifetime.end();\n            func.apply(self, arguments);\n        };\n    }\n};\n\n\n// SubscriberList.js\n\nTribe.PubSub.SubscriberList = function() {\n    var subscribers = {};\n    var lastUid = -1;\n\n    this.get = function (publishedTopic) {\n        var matching = [];\n        for (var registeredTopic in subscribers)\n            if (subscribers.hasOwnProperty(registeredTopic) && topicMatches(publishedTopic, registeredTopic))\n                matching = matching.concat(subscribers[registeredTopic]);\n        return matching;\n    };\n\n    this.add = function (topic, handler) {\n        var token = (++lastUid).toString();\n        if (!subscribers.hasOwnProperty(topic))\n            subscribers[topic] = [];\n        subscribers[topic].push({ topic: topic, handler: handler, token: token });\n        return token;\n    };\n\n    this.remove = function(token) {\n        for (var m in subscribers)\n            if (subscribers.hasOwnProperty(m))\n                for (var i = 0, l = subscribers[m].length; i < l; i++)\n                    if (subscribers[m][i].token === token) {\n                        subscribers[m].splice(i, 1);\n                        return token;\n                    }\n\n        return false;\n    };\n\n    function topicMatches(published, subscriber) {\n        if (subscriber === '*')\n            return true;\n        \n        var expression = \"^\" + subscriber\n            .replace(/\\./g, \"\\\\.\")\n            .replace(/\\*/g, \"[^\\.]*\") + \"$\";\n        return published.match(expression);\n    }\n};\n\n\n// utils.js\n\nTribe.PubSub.utils = {};\n(function(utils) {\n    utils.isArray = function (source) {\n        return source.constructor === Array;\n    };\n\n    // The following functions are taken from the underscore library, duplicated to avoid dependency. License at http://underscorejs.org.\n    var nativeForEach = Array.prototype.forEach;\n    var nativeMap = Array.prototype.map;\n    var breaker = {};\n\n    utils.each = function (obj, iterator, context) {\n        if (obj == null) return;\n        if (nativeForEach && obj.forEach === nativeForEach) {\n            obj.forEach(iterator, context);\n        } else if (obj.length === +obj.length) {\n            for (var i = 0, l = obj.length; i < l; i++) {\n                if (iterator.call(context, obj[i], i, obj) === breaker) return;\n            }\n        } else {\n            for (var key in obj) {\n                if (obj.hasOwnProperty(key)) {\n                    if (iterator.call(context, obj[key], key, obj) === breaker) return;\n                }\n            }\n        }\n    };\n\n    utils.map = function (obj, iterator, context) {\n        var results = [];\n        if (obj == null) return results;\n        if (nativeMap && obj.map === nativeMap) return obj.map(iterator, context);\n        utils.each(obj, function (value, index, list) {\n            results[results.length] = iterator.call(context, value, index, list);\n        });\n        return results;\n    };\n\n    utils.copyProperties = function (source, target, properties) {\n        for (var i = 0, l = properties.length; i < l; i++) {\n            var property = properties[i];\n            if(source.hasOwnProperty(property))\n                target[property] = source[property];\n        }\n    };\n\n    utils.errorDetails = function (ex) {\n        if (!ex) return '';\n        return (ex.constructor === String) ? ex :\n            (ex.stack || '') + (ex.inner ? '\\n\\n' + utils.errorDetails(ex.inner) : '\\n');\n    };\n})(Tribe.PubSub.utils);\n\n\n\n// Actor.core.js\n\n(function () {\n    var utils = Tribe.PubSub.utils;\n\n    Tribe.PubSub.Actor = function (pubsub, definition) {\n        var self = this;\n\n        pubsub = pubsub.createLifetime();\n        this.pubsub = pubsub;\n        this.children = [];\n\n        configureActor();\n        this.handles = this.handles || {};\n\n        // TODO: this is not ie<9 compatible and includes onstart / onend\n        this.topics = Object.keys(this.handles);\n\n        function configureActor() {\n            if (definition)\n                if (definition.constructor === Function)\n                    definition(self);\n                else\n                    Tribe.PubSub.utils.copyProperties(definition, self, ['handles', 'endsChildrenExplicitly']);\n        }\n    };\n\n    Tribe.PubSub.Actor.prototype.start = function (startData) {\n        utils.each(this.handles, this.addHandler, this);\n        if (this.handles.onstart) this.handles.onstart(startData, this);\n        return this;\n    };\n\n    Tribe.PubSub.Actor.prototype.startChild = function (child, onstartData) {\n        this.children.push(new Tribe.PubSub.Actor(this.pubsub, child)\n            .start(onstartData));\n        return this;\n    };\n\n    Tribe.PubSub.Actor.prototype.join = function (data, onjoinData) {\n        utils.each(this.handles, this.addHandler, this);\n        this.data = data;\n        if (this.handles.onjoin) this.handles.onjoin(onjoinData, this);\n        return this;\n    };\n\n    Tribe.PubSub.Actor.prototype.end = function (onendData) {\n        if (this.handles.onend) this.handles.onend(onendData, this);\n        this.pubsub.end();\n        this.endChildren(onendData);\n        return this;\n    };\n\n    Tribe.PubSub.Actor.prototype.endChildren = function (data) {\n        Tribe.PubSub.utils.each(this.children, function (child) {\n            child.end(data);\n        });\n    };\n    \n    Tribe.PubSub.Actor.startActor = function (definition, data) {\n        return new Tribe.PubSub.Actor(this, definition).start(data);\n    };\n\n    Tribe.PubSub.prototype.startActor = Tribe.PubSub.Actor.startActor;\n    Tribe.PubSub.Lifetime.prototype.startActor = Tribe.PubSub.Actor.startActor;\n})();\n\n\n\n// Actor.handlers.js\n\nTribe.PubSub.Actor.prototype.addHandler = function (handler, topic) {\n    var self = this;\n\n    if (topic !== 'onstart' && topic !== 'onend' && topic !== 'onjoin')\n        if (!handler)\n            this.pubsub.subscribe(topic, endHandler());\n        else if (handler.constructor === Function)\n            this.pubsub.subscribe(topic, messageHandlerFor(handler));\n        else\n            this.pubsub.subscribe(topic, childHandlerFor(handler));\n\n    function messageHandlerFor(handler) {\n        return function (messageData, envelope) {\n            if (!self.endsChildrenExplicitly)\n                self.endChildren(messageData);\n\n            if (self.preMessage) self.preMessage(envelope);\n            handler(messageData, envelope, self);\n            if (self.postMessage) self.postMessage(envelope);\n        };\n    }\n\n    function childHandlerFor(childHandlers) {\n        return function (messageData, envelope) {\n            self.startChild({ handles: childHandlers }, messageData);\n        };\n    }\n\n    function endHandler() {\n        return function (messageData) {\n            self.end(messageData);\n        };\n    }\n};\n\n\n\n// exports.js\n\nif (typeof(module) !== 'undefined')\n    module.exports = new Tribe.PubSub();\n\n//@ sourceURL=http://tribe//node_modules/tribe.pubsub/Build/Tribe.PubSub.js\n", arguments, window, require, module, exports);
(function () {
// PubSub.js

if (typeof (Tribe) === 'undefined')
    Tribe = {};

Tribe.PubSub = function (options) {
    var self = this;
    var utils = Tribe.PubSub.utils;

    this.owner = this;
    this.options = options || {};
    this.sync = option('sync');
     
    var subscribers = new Tribe.PubSub.SubscriberList();
    this.subscribers = subscribers;

    function publish(envelope) {
        var messageSubscribers = subscribers.get(envelope.topic);
        var sync = envelope.sync === true || self.sync === true;

        for (var i = 0, l = messageSubscribers.length; i < l; i++) {
            if (sync)
                executeSubscriber(messageSubscribers[i].handler);
            else {
                (function (subscriber) {
                    setTimeout(function () {
                        executeSubscriber(subscriber.handler);
                    });
                })(messageSubscribers[i]);
            }
        }

        function executeSubscriber(func) {
            var exceptionHandler = option('exceptionHandler');
            
            if(option('handleExceptions')  && exceptionHandler)
                try {
                    func(envelope.data, envelope);
                } catch (e) {
                    exceptionHandler(e, envelope);
                }
            else
                func(envelope.data, envelope);
        }
    }

    this.publish = function (topicOrEnvelope, data) {
        return publish(createEnvelope(topicOrEnvelope, data));
    };

    this.publishSync = function (topicOrEnvelope, data) {
        var envelope = createEnvelope(topicOrEnvelope, data);
        envelope.sync = true;
        return publish(envelope);
    };
    
    function createEnvelope(topicOrEnvelope, data) {
        return topicOrEnvelope && topicOrEnvelope.topic
            ? topicOrEnvelope
            : { topic: topicOrEnvelope, data: data };
    }

    this.subscribe = function (topic, func) {
        if (typeof (topic) === "string")
            return subscribers.add(topic, func);
        else if (utils.isArray(topic))
            return utils.map(topic, function(topicName) {
                return subscribers.add(topicName, func);
            });
        else
            return utils.map(topic, function (individualFunc, topicName) {
                return subscribers.add(topicName, individualFunc);
            });
    };

    this.unsubscribe = function (tokens) {
        if (Tribe.PubSub.utils.isArray(tokens)) {
            var results = [];
            for (var i = 0, l = tokens.length; i < l; i++)
                results.push(subscribers.remove(tokens[i]));
            return results;
        }

        return subscribers.remove(tokens);
    };

    this.createLifetime = function() {
        return new Tribe.PubSub.Lifetime(self, self);
    };

    this.channel = function(channelId) {
        return new Tribe.PubSub.Channel(self, channelId);
    };
    
    function option(name) {
        return (self.options.hasOwnProperty(name)) ? self.options[name] : Tribe.PubSub.options[name];
    }
};


// Channel.js

Tribe.PubSub.Channel = function (pubsub, channelId) {
    var self = this;
    pubsub = pubsub.createLifetime();

    this.id = channelId;
    this.owner = pubsub.owner;

    this.publish = function (topicOrEnvelope, data) {
        return pubsub.publish(createEnvelope(topicOrEnvelope, data));
    };

    this.publishSync = function (topicOrEnvelope, data) {
        return pubsub.publishSync(createEnvelope(topicOrEnvelope, data));
    };

    this.subscribe = function(topic, func) {
        return pubsub.subscribe(topic, filterMessages(func));
    };

    this.subscribeOnce = function(topic, func) {
        return pubsub.subscribeOnce(topic, filterMessages(func));
    };
    
    this.unsubscribe = function(token) {
        return pubsub.unsubscribe(token);
    };

    this.end = function() {
        return pubsub.end();
    };

    this.createLifetime = function () {
        return new Tribe.PubSub.Lifetime(self, self.owner);
    };

    function createEnvelope(topicOrEnvelope, data) {
        var envelope = topicOrEnvelope && topicOrEnvelope.topic
          ? topicOrEnvelope
          : { topic: topicOrEnvelope, data: data };
        envelope.channelId = channelId;
        return envelope;
    }
    
    function filterMessages(func) {
        return function(data, envelope) {
            if (envelope.channelId === channelId)
                func(data, envelope);
        };
    }
};


// Lifetime.js

Tribe.PubSub.Lifetime = function (parent, owner) {
    var self = this;
    var tokens = [];

    this.owner = owner;

    this.publish = function(topicOrEnvelope, data) {
        return parent.publish(topicOrEnvelope, data);
    };

    this.publishSync = function(topic, data) {
        return parent.publishSync(topic, data);
    };

    this.subscribe = function(topic, func) {
        var token = parent.subscribe(topic, func);
        return recordToken(token);
    };

    this.subscribeOnce = function(topic, func) {
        var token = parent.subscribeOnce(topic, func);
        return recordToken(token);
    };
    
    this.unsubscribe = function(token) {
        // we should really remove the token(s) from our token list, but it has trivial impact if we don't
        return parent.unsubscribe(token);
    };

    this.channel = function(channelId) {
        return new Tribe.PubSub.Channel(self, channelId);
    };

    this.end = function() {
        return parent.unsubscribe(tokens);
    };

    this.createLifetime = function() {
        return new Tribe.PubSub.Lifetime(self, self.owner);
    };
    
    function recordToken(token) {
        if (Tribe.PubSub.utils.isArray(token))
            tokens = tokens.concat(token);
        else
            tokens.push(token);
        return token;
    }
};


// options.js

Tribe.PubSub.options = {
    sync: false,
    handleExceptions: true,
    exceptionHandler: function(e, envelope) {
        typeof(console) !== 'undefined' && console.log("Exception occurred in subscriber to '" + envelope.topic + "': " + Tribe.PubSub.utils.errorDetails(e));
    }
};


// subscribeOnce.js

Tribe.PubSub.prototype.subscribeOnce = function (topic, handler) {
    var self = this;
    var utils = Tribe.PubSub.utils;
    var lifetime = this.createLifetime();

    if (typeof (topic) === "string")
        return lifetime.subscribe(topic, wrapHandler(handler));
    else if (utils.isArray(topic))
        return lifetime.subscribe(wrapTopicArray());
    else
        return lifetime.subscribe(wrapTopicObject());

    function wrapTopicArray() {
        var result = {};
        utils.each(topic, function(topicName) {
            result[topicName] = wrapHandler(handler);
        });
        return result;
    }
    
    function wrapTopicObject() {
        return utils.map(topic, function (func, topicName) {
            return lifetime.subscribe(topicName, wrapHandler(func));
        });
    }

    function wrapHandler(func) {
        return function() {
            lifetime.end();
            func.apply(self, arguments);
        };
    }
};


// SubscriberList.js

Tribe.PubSub.SubscriberList = function() {
    var subscribers = {};
    var lastUid = -1;

    this.get = function (publishedTopic) {
        var matching = [];
        for (var registeredTopic in subscribers)
            if (subscribers.hasOwnProperty(registeredTopic) && topicMatches(publishedTopic, registeredTopic))
                matching = matching.concat(subscribers[registeredTopic]);
        return matching;
    };

    this.add = function (topic, handler) {
        var token = (++lastUid).toString();
        if (!subscribers.hasOwnProperty(topic))
            subscribers[topic] = [];
        subscribers[topic].push({ topic: topic, handler: handler, token: token });
        return token;
    };

    this.remove = function(token) {
        for (var m in subscribers)
            if (subscribers.hasOwnProperty(m))
                for (var i = 0, l = subscribers[m].length; i < l; i++)
                    if (subscribers[m][i].token === token) {
                        subscribers[m].splice(i, 1);
                        return token;
                    }

        return false;
    };

    function topicMatches(published, subscriber) {
        if (subscriber === '*')
            return true;
        
        var expression = "^" + subscriber
            .replace(/\./g, "\\.")
            .replace(/\*/g, "[^\.]*") + "$";
        return published.match(expression);
    }
};


// utils.js

Tribe.PubSub.utils = {};
(function(utils) {
    utils.isArray = function (source) {
        return source.constructor === Array;
    };

    // The following functions are taken from the underscore library, duplicated to avoid dependency. License at http://underscorejs.org.
    var nativeForEach = Array.prototype.forEach;
    var nativeMap = Array.prototype.map;
    var breaker = {};

    utils.each = function (obj, iterator, context) {
        if (obj == null) return;
        if (nativeForEach && obj.forEach === nativeForEach) {
            obj.forEach(iterator, context);
        } else if (obj.length === +obj.length) {
            for (var i = 0, l = obj.length; i < l; i++) {
                if (iterator.call(context, obj[i], i, obj) === breaker) return;
            }
        } else {
            for (var key in obj) {
                if (obj.hasOwnProperty(key)) {
                    if (iterator.call(context, obj[key], key, obj) === breaker) return;
                }
            }
        }
    };

    utils.map = function (obj, iterator, context) {
        var results = [];
        if (obj == null) return results;
        if (nativeMap && obj.map === nativeMap) return obj.map(iterator, context);
        utils.each(obj, function (value, index, list) {
            results[results.length] = iterator.call(context, value, index, list);
        });
        return results;
    };

    utils.copyProperties = function (source, target, properties) {
        for (var i = 0, l = properties.length; i < l; i++) {
            var property = properties[i];
            if(source.hasOwnProperty(property))
                target[property] = source[property];
        }
    };

    utils.errorDetails = function (ex) {
        if (!ex) return '';
        return (ex.constructor === String) ? ex :
            (ex.stack || '') + (ex.inner ? '\n\n' + utils.errorDetails(ex.inner) : '\n');
    };
})(Tribe.PubSub.utils);



// Actor.core.js

(function () {
    var utils = Tribe.PubSub.utils;

    Tribe.PubSub.Actor = function (pubsub, definition) {
        var self = this;

        pubsub = pubsub.createLifetime();
        this.pubsub = pubsub;
        this.children = [];

        configureActor();
        this.handles = this.handles || {};

        // TODO: this is not ie<9 compatible and includes onstart / onend
        this.topics = Object.keys(this.handles);

        function configureActor() {
            if (definition)
                if (definition.constructor === Function)
                    definition(self);
                else
                    Tribe.PubSub.utils.copyProperties(definition, self, ['handles', 'endsChildrenExplicitly']);
        }
    };

    Tribe.PubSub.Actor.prototype.start = function (startData) {
        utils.each(this.handles, this.addHandler, this);
        if (this.handles.onstart) this.handles.onstart(startData, this);
        return this;
    };

    Tribe.PubSub.Actor.prototype.startChild = function (child, onstartData) {
        this.children.push(new Tribe.PubSub.Actor(this.pubsub, child)
            .start(onstartData));
        return this;
    };

    Tribe.PubSub.Actor.prototype.join = function (data, onjoinData) {
        utils.each(this.handles, this.addHandler, this);
        this.data = data;
        if (this.handles.onjoin) this.handles.onjoin(onjoinData, this);
        return this;
    };

    Tribe.PubSub.Actor.prototype.end = function (onendData) {
        if (this.handles.onend) this.handles.onend(onendData, this);
        this.pubsub.end();
        this.endChildren(onendData);
        return this;
    };

    Tribe.PubSub.Actor.prototype.endChildren = function (data) {
        Tribe.PubSub.utils.each(this.children, function (child) {
            child.end(data);
        });
    };
    
    Tribe.PubSub.Actor.startActor = function (definition, data) {
        return new Tribe.PubSub.Actor(this, definition).start(data);
    };

    Tribe.PubSub.prototype.startActor = Tribe.PubSub.Actor.startActor;
    Tribe.PubSub.Lifetime.prototype.startActor = Tribe.PubSub.Actor.startActor;
})();



// Actor.handlers.js

Tribe.PubSub.Actor.prototype.addHandler = function (handler, topic) {
    var self = this;

    if (topic !== 'onstart' && topic !== 'onend' && topic !== 'onjoin')
        if (!handler)
            this.pubsub.subscribe(topic, endHandler());
        else if (handler.constructor === Function)
            this.pubsub.subscribe(topic, messageHandlerFor(handler));
        else
            this.pubsub.subscribe(topic, childHandlerFor(handler));

    function messageHandlerFor(handler) {
        return function (messageData, envelope) {
            if (!self.endsChildrenExplicitly)
                self.endChildren(messageData);

            if (self.preMessage) self.preMessage(envelope);
            handler(messageData, envelope, self);
            if (self.postMessage) self.postMessage(envelope);
        };
    }

    function childHandlerFor(childHandlers) {
        return function (messageData, envelope) {
            self.startChild({ handles: childHandlers }, messageData);
        };
    }

    function endHandler() {
        return function (messageData) {
            self.end(messageData);
        };
    }
};



// exports.js

if (typeof(module) !== 'undefined')
    module.exports = new Tribe.PubSub();
})
},{"tribe/client/enhancedDebug":97}],105:[function(require,module,exports){
require("tribe/client/enhancedDebug").execute("module.exports = {\n    serialize: function (source) {\n        return JSON.stringify(this.extractMetadata(source), function (key, value) {\n            return ko.unwrap(value);\n        });\n    },\n    deserialize: function (source) {\n        source = JSON.parse(source);\n        if (source.target)\n            return this.applyMetadata(source.target, source.metadata);\n        return source;\n    },\n    extractMetadata: function (source) {\n        return {\n            target: source,\n            metadata: {\n                observables: extractObservables(source)\n            }\n        };\n\n        function extractObservables(object, metadata, propertyExpression) {\n            metadata = metadata || [];\n\n            if (ko.isObservable(object)) {\n                metadata.push(propertyExpression);\n                object = object();\n            }\n\n            for (var property in object) {\n                if (object.hasOwnProperty(property)) {\n                    var fullPropertyExpression = constructPropertyExpression(property);\n\n                    if (ko.isObservable(object[property]))\n                        metadata.push(fullPropertyExpression);\n\n                    // recurse\n                    var value = ko.unwrap(object[property]);\n                    if (value) {\n                        if (value.constructor === Object)\n                            extractObservables(value, metadata, fullPropertyExpression);\n                        else if (value.constructor === Array)\n                            for (var i = 0, l = value.length; i < l; i++)\n                                extractObservables(value[i], metadata, arrayPropertyExpression(fullPropertyExpression, i));\n                    }\n                }\n            }\n            return metadata;\n\n            function constructPropertyExpression(property) {\n                return propertyExpression ? propertyExpression + '.' + property : property;\n            }\n\n            function arrayPropertyExpression(property, index) {\n                return property + '[' + index + ']';\n            }\n        }\n    },\n    applyMetadata: function (object, metadata) {\n        if (metadata)\n            restoreObservables();\n        return object;\n\n        function restoreObservables() {\n            var observables = metadata.observables;\n            for (var i = 0, l = observables.length; i < l; i++)\n                restoreProperty(object, observables[i]);\n        }\n\n        function restoreProperty(target, property) {\n            var dotIndex = property.indexOf('.');\n            if (dotIndex > -1) {\n                var thisProperty = property.substring(0, dotIndex),\n                    remainder = property.substring(dotIndex + 1);\n                restoreProperty(resolveProperty(target, thisProperty), remainder);\n            } else {\n                restoreArrayProperty(target, property);\n            }\n        }\n\n        function resolveProperty(target, property) {\n            var matches = property.match(/(.*)\\[(.*)]/);\n\n            if (matches && matches.length === 3) {\n                var arrayProperty = matches[1],\n                    index = matches[2];\n                return ko.unwrap(target[arrayProperty])[index];\n            }\n            return ko.unwrap(target[property]);\n        }\n\n        function restoreArrayProperty(target, property) {\n            var matches = property.match(/(.*)\\[(.*)]/);\n\n            if (matches && matches.length === 3) {\n                var arrayProperty = matches[1],\n                    index = matches[2];\n                return target[arrayProperty][index] = createObservable(target[arrayProperty][index]);\n            }\n            return target[property] = createObservable(target[property]);\n        }\n\n        function createObservable(value) {\n            return (value && value.constructor === Array) ?\n                ko.observableArray(value) :\n                ko.observable(value);\n        }\n    }\n};\n\n//@ sourceURL=http://tribe//utilities/serializer.js\n", arguments, window, require, module, exports);
(function () {module.exports = {
    serialize: function (source) {
        return JSON.stringify(this.extractMetadata(source), function (key, value) {
            return ko.unwrap(value);
        });
    },
    deserialize: function (source) {
        source = JSON.parse(source);
        if (source.target)
            return this.applyMetadata(source.target, source.metadata);
        return source;
    },
    extractMetadata: function (source) {
        return {
            target: source,
            metadata: {
                observables: extractObservables(source)
            }
        };

        function extractObservables(object, metadata, propertyExpression) {
            metadata = metadata || [];

            if (ko.isObservable(object)) {
                metadata.push(propertyExpression);
                object = object();
            }

            for (var property in object) {
                if (object.hasOwnProperty(property)) {
                    var fullPropertyExpression = constructPropertyExpression(property);

                    if (ko.isObservable(object[property]))
                        metadata.push(fullPropertyExpression);

                    // recurse
                    var value = ko.unwrap(object[property]);
                    if (value) {
                        if (value.constructor === Object)
                            extractObservables(value, metadata, fullPropertyExpression);
                        else if (value.constructor === Array)
                            for (var i = 0, l = value.length; i < l; i++)
                                extractObservables(value[i], metadata, arrayPropertyExpression(fullPropertyExpression, i));
                    }
                }
            }
            return metadata;

            function constructPropertyExpression(property) {
                return propertyExpression ? propertyExpression + '.' + property : property;
            }

            function arrayPropertyExpression(property, index) {
                return property + '[' + index + ']';
            }
        }
    },
    applyMetadata: function (object, metadata) {
        if (metadata)
            restoreObservables();
        return object;

        function restoreObservables() {
            var observables = metadata.observables;
            for (var i = 0, l = observables.length; i < l; i++)
                restoreProperty(object, observables[i]);
        }

        function restoreProperty(target, property) {
            var dotIndex = property.indexOf('.');
            if (dotIndex > -1) {
                var thisProperty = property.substring(0, dotIndex),
                    remainder = property.substring(dotIndex + 1);
                restoreProperty(resolveProperty(target, thisProperty), remainder);
            } else {
                restoreArrayProperty(target, property);
            }
        }

        function resolveProperty(target, property) {
            var matches = property.match(/(.*)\[(.*)]/);

            if (matches && matches.length === 3) {
                var arrayProperty = matches[1],
                    index = matches[2];
                return ko.unwrap(target[arrayProperty])[index];
            }
            return ko.unwrap(target[property]);
        }

        function restoreArrayProperty(target, property) {
            var matches = property.match(/(.*)\[(.*)]/);

            if (matches && matches.length === 3) {
                var arrayProperty = matches[1],
                    index = matches[2];
                return target[arrayProperty][index] = createObservable(target[arrayProperty][index]);
            }
            return target[property] = createObservable(target[property]);
        }

        function createObservable(value) {
            return (value && value.constructor === Array) ?
                ko.observableArray(value) :
                ko.observable(value);
        }
    }
};
})
},{"tribe/client/enhancedDebug":97}]},{},[5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,1,2,3,4])