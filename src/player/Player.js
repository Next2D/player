/**
 * @class
 */
class Player
{
    /**
     * @constructor
     * @public
     */
    constructor()
    {
        this._$broadcastEvents = Util.$getMap();
    }

    /**
     * @description
     *
     * @return   {Map}
     * @readonly
     * @public
     */
    get broadcastEvents ()
    {
        return this._$broadcastEvents;
    }

    /**
     * @return {void}
     * @method
     * @public
     */
    play ()
    {

    }

    /**
     * @return {void}
     * @method
     * @public
     */
    stop ()
    {

    }
}