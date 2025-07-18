const tree = [
    {
        type: "folder",
        name: "src",
        children: [
            {
                type: "folder",
                name: "components",
                children: [
                    { type: "file", name: "Header.js" },
                    { type: "file", name: "Footer.js" },
                ],
            },
            { type: "file", name: "index.js" },
            {
                type: "folder",
                name: "utils",
                children: [{ type: "file", name: "helpers.js" }],
            },
        ],
    },
    {
        type: "folder",
        name: "public",
        children: [{ type: "file", name: "index.html" }],
    },
    { type: "file", name: "package.json" },
    { type: "file", name: "README.md" },
];

const rootContainer = document.getElementById("file-tree-root");

function renderTree(nodes, parentElement) {
    // Tạo một danh sách ul cho các node hiện tại
    const ul = document.createElement("ul");

    for (const node of nodes) {
        const li = document.createElement("li");

        // Tạo phần tử hiển thị tên và icon
        const itemDiv = document.createElement("div");
        itemDiv.classList.add("item");

        const icon = document.createElement("i");
        const nameSpan = document.createElement("span");
        nameSpan.textContent = node.name;

        itemDiv.appendChild(icon);
        itemDiv.appendChild(nameSpan);
        li.appendChild(itemDiv);

        if (node.type === "folder") {
            li.classList.add("folder");
            icon.classList.add("icon-folder");

            // Gắn sự kiện click để đóng/mở thư mục
            itemDiv.addEventListener("click", (event) => {
                // Ngăn sự kiện click nổi bọt
                event.stopPropagation();
                li.classList.toggle("open");
            });

            // Nếu có children, gọi đệ quy để render chúng
            if (node.children && node.children.length > 0) {
                renderTree(node.children, li);
            }
        } else {
            // Nếu là file
            const extension = node.name.split(".").pop();
            li.classList.add("file");
            icon.classList.add("icon-file", `icon-file--${extension}`);
        }

        ul.appendChild(li);
    }

    // Gắn danh sách ul đã tạo vào phần tử cha
    parentElement.appendChild(ul);
}

// Bắt đầu render cây thư mục vào container gốc
renderTree(tree, rootContainer);
