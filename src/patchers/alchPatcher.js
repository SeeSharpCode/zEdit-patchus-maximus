import { getLinkedRecord, removeMagicSchool } from '../utils';
import { getPotionMultiplier, getAlchemyEffect } from '../config';

export default function alchPatcher(patchFile, locals, settings) {
  const alchFilter = alch => !xelib.GetFlag(alch, 'ENIT\\Flags', 'Food Item')
    && !settings.alchemy.excludedEffects.some(effect => xelib.HasEffect(alch, effect))
    && !settings.alchemy.excludedPotionNames.includes(xelib.FullName(alch));

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

    const newDuration = alchemyEffect.baseDuration * potionMultiplier.multiplierDuration;
    const newMagnitude = alchemyEffect.baseMagnitude * potionMultiplier.multiplierMagnitude;
    const newCost = alchemyEffect.baseCost;

    xelib.SetFloatValue(effect, 'EFIT - \\Duration', newDuration);
    xelib.SetFloatValue(effect, 'EFIT - \\Magnitude', newMagnitude);
    xelib.SetFloatValue(mgef, 'Magic Effect Data\\DATA - Data\\Base Cost', newCost);
  };

  return {
    load: {
      signature: 'ALCH',
      filter: alch => locals.useThief && alchFilter(alch),
    },
    patch: alch => {
      removeMagicSchool(alch, patchFile);
      xelib.GetElements(alch, 'Effects').forEach(effect => makePotionEffectGradual(effect, xelib.FullName(alch)));
    },
  };
}
