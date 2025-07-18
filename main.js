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
    { name: "taptin_goc.txt", type: "file" },
];

const rootContainer = document.getElementById("file-tree-root");
const contextmenu = document.getElementById("context-menu");
let currentTargetElement = null;

function renderTree(nodes, parentElement) {
    // Tạo một danh sách ul cho các node hiện tại
    const ul = document.createElement("ul");

    for (const node of nodes) {
        const li = document.createElement("li");

        // Gắn node dữ liệu vào phần tử li để dễ dàng truy cập sau này
        li.node = node;

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

// Hiển thị và định vị context menu
rootContainer.addEventListener("contextmenu", (e) => {
    e.preventDefault();

    const target = e.target.closest(".item");
    if (target) {
        currentTargetElement = target;
        contextmenu.style.display = "block";
        contextmenu.style.left = `${e.clientX}px`;
        contextmenu.style.top = `${e.clientY}px`;
    } else {
        contextmenu.style.display = "none";
        currentTargetElement = null;
    }
});

//Ẩn Menu Content khi click ra ngoài
document.addEventListener("click", () => {
    contextmenu.style.display = "none";
    currentTargetElement = null;
});

//Rename handle
const renameItem = () => {
    if (!currentTargetElement) return;
    const li = currentTargetElement.parentElement;
    const node = li.node;
    const nameSpan = currentTargetElement.querySelector("span");

    const input = document.createElement("input");
    input.type = "text";
    input.value = nameSpan.textContent;

    // Thay thế span bằng input
    currentTargetElement.replaceChild(input, nameSpan);
    input.focus();
    input.select();

    const completeRename = () => {
        const newName = input.value.trim();
        if (newName && newName !== node.name) {
            // Cập nhật lại icon nếu là file và có phần mở rộng thay đổi
            if (node.type === "file") {
                const icon = currentTargetElement.querySelector("i");
                const oldExtension = (
                    node.name.split(".").pop() || ""
                ).toLowerCase();
                const newExtension = (
                    newName.split(".").pop() || ""
                ).toLowerCase();
                if (oldExtension !== newExtension) {
                    icon.className = `icon-file icon-file--${newExtension}`;
                }
            }
            node.name = newName; // Cập nhật dữ liệu
            nameSpan.textContent = newName; // Cập nhật giao diện
        }
        // Khôi phục lại span
        currentTargetElement.replaceChild(nameSpan, input);
        // Dọn dẹp event listeners
        input.removeEventListener("blur", completeRename);
        input.removeEventListener("keydown", handleKeyDown);
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            completeRename();
        } else if (e.key === "Escape") {
            // Hủy đổi tên, khôi phục lại span
            currentTargetElement.replaceChild(nameSpan, input);
            input.removeEventListener("blur", completeRename);
            input.removeEventListener("keydown", handleKeyDown);
        }
    };

    input.addEventListener("blur", completeRename);
    input.addEventListener("keydown", handleKeyDown);
};

// Gắn sự kiện click cho mục "Rename" trong context menu
document.getElementById("rename")?.addEventListener("click", renameItem);
