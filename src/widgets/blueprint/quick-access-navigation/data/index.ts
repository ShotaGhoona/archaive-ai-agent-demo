import revisionBlueprintsRaw from './revisionBlueprints.json';
import sameProjectBlueprintsRaw from './sameProjectBlueprints.json';
import { RevisionBlueprint, SameProjectBlueprint } from '../model/types';

// 鬼のバグが起きているが時間がなくてとりあえず動くものにしています
// 本物のデータを流し込んだらこの辺いらんくなるので一旦許して
export const revisionBlueprintsData: { revisionBlueprints: RevisionBlueprint[] } = revisionBlueprintsRaw as { revisionBlueprints: RevisionBlueprint[] };
export const sameProjectBlueprintsData: { sameProjectBlueprints: SameProjectBlueprint[] } = sameProjectBlueprintsRaw as { sameProjectBlueprints: SameProjectBlueprint[] };