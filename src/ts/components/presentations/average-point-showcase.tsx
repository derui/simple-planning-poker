import { Component, For } from "solid-js";

interface Props {
  cardCounts: [number, number][];
  averagePoint: string;
}

const AveragePointShowcase: Component<Props> = (props) => {
  return (
    <div class="app__game__average-point-showcase">
      <div class="app__game__average-point-showcase__results">
        <For each={props.cardCounts}>
          {([storyPoint, count]) => (
            <div class="app__game__result-display">
              <span class="app__game__result-display__card">{storyPoint}</span>
              <span class="app__game__result-display__count">{count} votes</span>
            </div>
          )}
        </For>
      </div>

      <div class="app__game__average-point-showcase__equal"> </div>
      <div class="app__game__average-point-showcase__average">
        <span class="app__game__average-point-showcase__average-label">Score</span>
        <span class="app__game__average-point-showcase__average-value">{props.averagePoint}</span>
      </div>
    </div>
  );
};

export default AveragePointShowcase;
