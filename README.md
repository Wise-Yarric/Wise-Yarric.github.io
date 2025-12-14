<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Ethers.js Example</title>
  <!-- Подключение библиотеки Ethers.js -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/ethers/5.2.0/ethers.umd.js">
  </script>
</head>
<body>
  <h1>Простой контракт Ethers.js</h1>

  <input type="text" id="messageInput" placeholder="Введите сообщение">
  <button id="setMessageButton">Установить сообщение</button>
  <button id="getMessageButton">Получить сообщение</button>

  <p>Сообщение: <span id="messageDisplay"></span></p>

  <script src="script.js"></script>
</body>
</html>
