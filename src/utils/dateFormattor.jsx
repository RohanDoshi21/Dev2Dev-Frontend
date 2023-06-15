function formattedDate(createdAt) {
    const date = new Date(createdAt);
    return `${date.getDate()} ${date.toLocaleString("default", {
        month: "short",
    })} ${date.getFullYear()}`;
}

export default formattedDate;
