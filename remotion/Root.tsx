import { Composition } from "remotion";
import { HelloWorld } from "./HelloWorld";
import { Preco26, PRECO26_FRAMES } from "./Preco26";
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
  </>
);
