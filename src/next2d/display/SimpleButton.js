/**
 * @class
 * @memberOf next2d.display
 * @extends  InteractiveObject
 */
class SimpleButton extends InteractiveObject
{
    /**
     * @constructor
     * @public
     */
    constructor()
    {
        super();
    }

    /**
     * @param {string} state
     *
     * @return {void}
     * @method
     * @private
     */
    _$changeState (state)
    {
        console.log("TODO", state);
    }
}