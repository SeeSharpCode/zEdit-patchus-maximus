import { getLinkedRecord, removeMagicSchool } from '../utils';
import { isExcludedFromPatching } from '../exclusions';
import { getPotionMultiplier, getAlchemyEffect } from '../config';

export default function alchPatcher(patchFile, locals) {
  const addDurationToDescription = function (mgef) {
    const mgefDescription = xelib.GetValue(mgef, 'DNAM - Magic Item Description');
    if (!mgefDescription.includes('<dur>')) {
      xelib.SetFlag(mgef, 'Magic Effect Data\\DATA - Data\\Flags', 'No Duration', false);
      const newDescription = `${mgefDescription} [Duration: <dur> seconds]`;
      xelib.SetValue(mgef, 'DNAM - Magic Item Description', newDescription);
    }
  };

  const makePotionEffectGradual = function (effect, recordName) {
    const mgef = getLinkedRecord(effect, 'EFID', patchFile);
    const alchemyEffect = getAlchemyEffect(xelib.FullName(mgef));
    if (!alchemyEffect || !alchemyEffect.allowPotionMultiplier) return;

    const potionMultiplier = getPotionMultiplier(recordName);
    if (!potionMultiplier) return;

    addDurationToDescription(mgef);

    // const oldDuration = xelib.GetFloatValue(effect, 'EFIT - \\Duration');
    // const oldMagnitude = xelib.GetFloatValue(effect, 'EFIT - \\Duration');
    // const oldCost = xelib.GetFloatValue(mgef, 'Magic Effect Data\\DATA - Data\\Base Cost');
    const newDuration = alchemyEffect.baseDuration * potionMultiplier.multiplierDuration;
    const newMagnitude = alchemyEffect.baseMagnitude * potionMultiplier.multiplierMagnitude;
    const newCost = alchemyEffect.baseCost;

    // TODO only change if new value != old value
    // Or is that needed? Why not change it anyway?
    xelib.SetFloatValue(effect, 'EFIT - \\Duration', newDuration);
    xelib.SetFloatValue(effect, 'EFIT - \\Magnitude', newMagnitude);
    xelib.SetFloatValue(mgef, 'Magic Effect Data\\DATA - Data\\Base Cost', newCost);
  };

  return {
    load: {
      signature: 'ALCH',
      filter: () => locals.useThief,
    },
    patch: alch => {
      removeMagicSchool(alch, patchFile);
      if (isExcludedFromPatching(alch)) return;
      xelib.GetElements(alch, 'Effects').forEach(effect => makePotionEffectGradual(effect, xelib.FullName(alch)));
    },
  };
}
