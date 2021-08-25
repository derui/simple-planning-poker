import React from "react";

interface Props {
  cardCounts: [number, number][];
  averagePoint: string;
}

const createResultDisplay = (index: number, storyPoint: number, count: number) => {
  return (
    <div className="app__game__result-display" key={index}>
      <span className="app__game__result-display__card">{storyPoint}</span>
      <span className="app__game__result-display__count">{count} votes</span>
    </div>
  );
};

export const AveragePointShowcaseComponent: React.FunctionComponent<Props> = (props) => {
  return (
    <div className="app__game__average-point-showcase">
      <div className="app__game__average-point-showcase__results">
        {props.cardCounts.map(([storyPoint, count], index) => createResultDisplay(index, storyPoint, count))}
      </div>

      <div className="app__game__average-point-showcase__equal"> </div>
      <div className="app__game__average-point-showcase__average">
        <span className="app__game__average-point-showcase__average-label">Score</span>
        <span className="app__game__average-point-showcase__average-value">{props.averagePoint}</span>
      </div>
    </div>
  );
};
