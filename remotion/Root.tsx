import { Composition } from "remotion";
import { HelloWorld } from "./HelloWorld";
import { Preco26, PRECO26_FRAMES } from "./Preco26";
import { R } from "./reels/ReelsA";
import { RB } from "./reels/ReelsB";
import { f } from "./reels/kit";
import { Vlog, VLOG_FRAMES, FPS } from "./Vlog";

export const RemotionRoot = () => (
  <>
  <Composition
    id="HelloWorld"
    component={HelloWorld}
    durationInFrames={90}
    fps={30}
    width={1920}
    height={1080}
  />
  <Composition id="Vlog" component={Vlog} durationInFrames={VLOG_FRAMES} fps={FPS} width={1080} height={1920} />
  <Composition id="Preco26" component={Preco26} durationInFrames={PRECO26_FRAMES} fps={30} width={1080} height={1920} />
  {Object.entries({ ...R, ...RB }).map(([id, r]) => (
    <Composition key={id} id={id} component={r.C} durationInFrames={f(r.tl.total)} fps={30} width={1080} height={1920} />
  ))}
  </>
);
