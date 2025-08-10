document.getElementById("addBtn").addEventListener("click", function () {
    const quant = document.getElementById("quant").value;
    const desc = document.getElementById("desc").value;
    const dataEntrada = document.getElementById("dataEntrada").value;
    const dataSaida = document.getElementById("dataSaida").value;
    const diaria = parseFloat(document.getElementById("diaria").value) || 0;
    const valorUnit = parseFloat(document.getElementById("valorUnit").value) || 0;

    if (!desc) return alert("Preencha a descrição do material.");

    const dias = dataSaida && dataEntrada
        ? Math.max(1, Math.ceil((new Date(dataSaida) - new Date(dataEntrada)) / (1000 * 60 * 60 * 24)))
        : 1;

    const total = (diaria * dias * quant) + (valorUnit * quant);

    const tbody = document.getElementById("tbody");
    const row = document.createElement("tr");

    row.innerHTML = `
        <td>${quant}</td>
        <td>${desc}</td>
        <td>${dataEntrada || "-"}</td>
        <td>${dataSaida || "-"}</td>
        <td>R$ ${diaria.toFixed(2)}</td>
        <td>R$ ${valorUnit.toFixed(2)}</td>
        <td>R$ ${total.toFixed(2)}</td>
        <td class="no-print"><button class="removeBtn">Excluir</button></td>
    `;

    tbody.appendChild(row);
    atualizarTotal();
});

document.getElementById("tbody").addEventListener("click", function (e) {
    if (e.target.classList.contains("removeBtn")) {
        e.target.closest("tr").remove();
        atualizarTotal();
    }
});

document.getElementById("clearBtn").addEventListener("click", function () {
    document.querySelectorAll("#quant, #desc, #dataEntrada, #dataSaida, #diaria, #valorUnit")
        .forEach(input => input.value = "");
});

document.getElementById("printBtn").addEventListener("click", function () {
    window.print();
});

document.getElementById("exportBtn").addEventListener("click", function () {
    let csv = "QUANT.,DESCRIÇÃO,DATA ENTRADA,DATA SAÍDA,DIÁRIA,VALOR UNITÁRIO,TOTAL\n";
    document.querySelectorAll("#tbody tr").forEach(row => {
        let cols = row.querySelectorAll("td");
        let data = [];
        cols.forEach(c => data.push(c.innerText));
        data.pop(); // remove coluna de ações
        csv += data.join(",") + "\n";
    });
    let blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    let link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "materiais.csv";
    link.click();
});

function atualizarTotal() {
    let total = 0;
    document.querySelectorAll("#tbody tr").forEach(row => {
        let valor = row.children[6].innerText.replace("R$ ", "").replace(",", ".");
        total += parseFloat(valor) || 0;
    });
    document.getElementById("grandTotal").innerText = "R$ " + total.toFixed(2);
}
