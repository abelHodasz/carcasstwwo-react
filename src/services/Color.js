const colors = {
    red: 0xff0000,
    green: 0x79ce00,
    blue: 0x00a5d4,
    yellow: 0xf9f500,
    purple: 0xb200ac,
};

export function* getColors() {
    for (const color of Object.values(colors)) {
        yield color;
    }
}
