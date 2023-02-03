import { useState } from "react";
import { Select, SelectOption } from "./Select";

const options = [
  {label: "First", value: 1},
  {label: "Second", value: 2},
  {label: "Third", value: 3},
  {label: "Fourth", value: 4},
  {label: "Fifth", value: 5},
  {label: "Sixth", value: 6},
  {label: "Seventh", value: 7},
  {label: "Eighth", value: 8},
  {label: "Ninth", value: 9},
  {label: "Tenth", value: 10},

];

function App() {
  const [value1, setValue1] = useState<SelectOption[]>([options[0]]);
  const [value2, setValue2] = useState<SelectOption | undefined>(options[0]);

  // ------------------------------------------
  return(
    <>
      <h3>Multiple Select Elements</h3>
      <Select multiple options={options} value={value1} onChange={o => setValue1(o)} />
      <br />
      {/* <br /> */}
      <h3>Single Select Elements</h3>
      <Select options={options} value={value2} onChange={o => setValue2(o)} />
    </>
  );
};

export default App
