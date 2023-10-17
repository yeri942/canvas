import React, { Component } from "react";
import styled from "styled-components";
import BubbleBlock from "../components/main/Bubble_block";

const MainWrap = styled.div`
    width: 100%;
    height: 100vh;
    background-color: #eebdff;
`;

class Main extends Component {
    render() {
        return (
            <MainWrap>
                <BubbleBlock />
            </MainWrap>
        );
    }
}

export default Main;
