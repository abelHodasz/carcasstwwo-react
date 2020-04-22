import React from "react";
import Home from "./Home";
import history from "../../App/history";
import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";
Enzyme.configure({ adapter: new Adapter() });

describe("App Testing", () => {
    let wrapper;
    beforeEach(() => {
        wrapper = Enzyme.shallow(<Home />);
    });

    test("Renders Enter name input", () => {
        expect(wrapper.find(".name-input").props().label).toContain(
            "Your Name"
        );
    });

    test("Renders Create Lobby Btton", () => {
        expect(wrapper.find(".create-lobby-btn").text()).toContain(
            "Create Lobby"
        );
    });
});
