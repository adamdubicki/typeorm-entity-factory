"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @abstract
 * @author Adam Dubicki
 * @class EntityFactory
 * @summary The Abstract EntityFactory is the class that all registered
 * factories must extend to produce entities.
 *
 * @typeparam E: The Entity that the factory generates
 * @typeparam O: The additional options the make function can take
 */
var EntityFactory = /** @class */ (function () {
    /** @constructor */
    function EntityFactory(
    /** @property connection: The database connection */
    connection) {
        this.connection = connection;
    }
    EntityFactory.prototype.make = function () { };
    EntityFactory.prototype.makeOne = function () { };
    EntityFactory.prototype.saveOne = function () { };
    EntityFactory.prototype.saveMany = function () { };
    return EntityFactory;
}());
exports.EntityFactory = EntityFactory;
