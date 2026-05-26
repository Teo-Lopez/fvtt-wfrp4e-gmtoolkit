import GMToolkit from "./gm-toolkit.mjs"

const PATCH_FLAG = Symbol("gmtoolkitTokenRulerSegmentStylePatch")

/**
 * Workaround for WFRP4e TokenRulerWFRP._getSegmentStyle accessing actor.system
 * when token.actor is null on gridless scenes (wfrp4e <= 9.6.1).
 * @see https://github.com/moo-man/WFRP4e-FoundryVTT/blob/master/src/canvas/token-ruler.js
 */
export function applyTokenRulerSegmentStylePatch () {
  const rulerClass = CONFIG.Token?.rulerClass
  const original = rulerClass?.prototype?._getSegmentStyle
  if (!original || original[PATCH_FLAG]) return

  rulerClass.prototype._getSegmentStyle = function (waypoint) {
    if (!this.token?.actor && canvas.scene?.grid?.type === CONST.GRID_TYPES.GRIDLESS) {
      const scale = canvas.dimensions.uiScale
      return { width: 4 * scale, color: game.user.color, alpha: 1 }
    }
    return original.call(this, waypoint)
  }
  rulerClass.prototype._getSegmentStyle[PATCH_FLAG] = true

  GMToolkit.log(false, "Applied TokenRuler segment style patch for tokens without actors.")
}
