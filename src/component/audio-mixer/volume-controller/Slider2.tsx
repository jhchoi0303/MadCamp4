import React from "react";
import styled from "styled-components/macro";
import { THEME_COLOR } from "../../../constants";
interface SliderProps {
  color: string;
  opacity: string;
}

interface SliderState {
  value: number;
}

const sliderThumbStyles = (props: SliderProps) => `
  width: 30px;
  height: 20px;
  background: ${THEME_COLOR.ORANGER};
  cursor: pointer;
  outline: 1px solid rgb(51,51,51,0.5);
  -webkit-transition: .2s;
  transition: opacity .2s;
`;

const Styles = styled.div`
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
  justify-content: center;

  width: 150px;
  margin: 20px 0 0 0;

  color: #888;

  .value {
    flex: 1;
    font-size: 2rem;
    text-align: center;
  }
  .slider {
    flex: 3;
    -webkit-appearance: none;
    width: 250px;
    height: 40px;
    border-radius: 5px;
    background: #efefef;
    outline: none;
    &::-webkit-slider-thumb {
      -webkit-appearance: none;
      appearance: none;
      ${(props: SliderProps) => sliderThumbStyles(props)}
    }
    &::-moz-range-thumb {
      ${(props: SliderProps) => sliderThumbStyles(props)}
    }
  }
`;

class Slider extends React.Component<SliderProps, SliderState> {
  constructor(props: SliderProps) {
    super(props);

    this.state = {
      value: 0,
    };
  }

  render() {
    const value = this.state.value;
    return (
      <Styles
        opacity={(value > 10 ? value / 255 : 0.1).toString()}
        color={this.props.color}
      >
        <input
          type="range"
          min={-100}
          max={100}
          value={this.state.value}
          className="slider ratio"
          onChange={(ev) => this.setState({ value: parseInt(ev.target.value) })}
        />
        <div className="value ratio-value">{this.state.value}</div>
      </Styles>
    );
  }
}

export default Slider;
