import {
    Box as Bx,
    Button as Btn,
    TextField as TxtFd,
    Container as Cnt,
    Typography as Tpg,
} from "@material-ui/core";
import styled from "styled-components";

const sectionStyle = `
    margin: 20px;
`;

const Box = styled(Bx)`
    ${({ component, centertext }) => {
        let style = `
        `;
        if (centertext) style += `text-align:center;`;
        if (component === "section") style += sectionStyle;
        return style;
    }}
`;

const Button = styled(Btn)`
    margin: 15px;
`;

const TextField = styled(TxtFd)``;

const Container = styled(Cnt)``;

const Typography = styled(Tpg)``;

export { Box, Button, TextField, Container, Typography };
