import React from "react";
import { render } from "@testing-library/react";
import App from "./App";

import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";

Enzyme.configure({ adapter: new Adapter() });

describe("App Testing", () => {
    test("Renders Hello World!", () => {
        const wrapper = Enzyme.shallow(<App />);
        expect(wrapper.find("p").text()).toContain("Hello world");
    });
});
