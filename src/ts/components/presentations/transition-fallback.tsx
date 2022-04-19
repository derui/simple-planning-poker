import React from "react";
import { Grid } from "react-loader-spinner";
import { CSSTransition } from "react-transition-group";

const DELAY = 300;

const TransitionFallback: React.FunctionComponent<{}> = () => {
  const [fade, setFade] = React.useState(true);

  React.useEffect(() => {
    const t = setTimeout(() => setFade(false), DELAY);
    return () => clearTimeout(t);
  }, []);

  return (
    <CSSTransition in={fade} timeout={DELAY} classNames="app__transition-fallback">
      <div className="app__transition-fallback">
        <Grid height={64} width={64} />
      </div>
    </CSSTransition>
  );
};

export default TransitionFallback;
