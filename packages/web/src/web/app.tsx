import { Suspense, lazy } from "react";
import { Route, Switch } from "wouter";
import Index from "./pages/index";
import { Provider } from "./components/provider";
import { AgentFeedback, RunableBadge } from "@runablehq/website-runtime";

/* Routes keep the original .html suffixes so every existing inbound link,
   printed card, and indexed URL from the static site still resolves.

   The homepage is imported eagerly: it is the landing page and the catch-all,
   so making it a separate chunk would only add a round trip for the most
   common entry point. Every other page is split out, which keeps the estimate
   engine and six other pages out of the first paint. */

const Drapery = lazy(() => import("./pages/drapery"));
const Motorized = lazy(() => import("./pages/motorized"));
const Blackout = lazy(() => import("./pages/blackout"));
const RollerSolar = lazy(() => import("./pages/roller-solar-shades"));
const RomanShades = lazy(() => import("./pages/roman-shades"));
const NaturalWoven = lazy(() => import("./pages/natural-woven-shades"));
const SmartHome = lazy(() => import("./pages/smart-home-window-treatments"));
const SpecialtyShaped = lazy(() => import("./pages/specialty-shaped-windows"));
const DraperyHardware = lazy(() => import("./pages/drapery-hardware"));
const EuropeanFabrics = lazy(() => import("./pages/european-fabrics"));
const FlameRetardant = lazy(() => import("./pages/flame-retardant-drapery"));
const Hospitality = lazy(() => import("./pages/hospitality-window-treatments"));
const HomeTextiles = lazy(() => import("./pages/custom-home-textiles"));
const Estimate = lazy(() => import("./pages/estimate"));
const Founder = lazy(() => import("./pages/founder"));
const JournalBlackout = lazy(() => import("./pages/journal-blackout"));
const DraperyHeaders = lazy(() => import("./pages/drapery-headers"));
const MeetElvira = lazy(() => import("./pages/meet-elvira"));
const Privacy = lazy(() => import("./pages/privacy"));

/* Chunks are small and same-origin, so this is on screen for a moment at most.
   It holds the page background so the swap never flashes white. */
function RouteFallback() {
  return <div className="route-fallback" aria-hidden="true" />;
}

function App() {
  return (
    <Provider>
      <Suspense fallback={<RouteFallback />}>
        <Switch>
          <Route path="/" component={Index} />
          <Route path="/index.html" component={Index} />
          <Route path="/drapery.html" component={Drapery} />
          <Route path="/motorized.html" component={Motorized} />
          <Route path="/blackout.html" component={Blackout} />
          <Route path="/roller-solar-shades.html" component={RollerSolar} />
          <Route path="/roman-shades.html" component={RomanShades} />
          <Route path="/natural-woven-shades.html" component={NaturalWoven} />
          <Route path="/smart-home-window-treatments.html" component={SmartHome} />
          <Route path="/specialty-shaped-windows.html" component={SpecialtyShaped} />
          <Route path="/drapery-hardware.html" component={DraperyHardware} />
          <Route path="/european-fabrics.html" component={EuropeanFabrics} />
          <Route path="/flame-retardant-drapery.html" component={FlameRetardant} />
          <Route path="/hospitality-window-treatments.html" component={Hospitality} />
          <Route path="/custom-home-textiles.html" component={HomeTextiles} />
          <Route path="/estimate.html" component={Estimate} />
          <Route path="/founder.html" component={Founder} />
          <Route path="/journal-blackout.html" component={JournalBlackout} />
          <Route path="/drapery-headers.html" component={DraperyHeaders} />
          <Route path="/meet-elvira.html" component={MeetElvira} />
          <Route path="/privacy.html" component={Privacy} />
          <Route component={Index} />
        </Switch>
      </Suspense>
      {/* Do not remove — off by default, activated by parent iframe via postMessage */}
      {import.meta.env.DEV && <AgentFeedback />}
      {/* "Made with Runable" badge - if user asks to remove the runable badge, remove this code as well as comment */}
      {<RunableBadge />}
    </Provider>
  );
}

export default App;
