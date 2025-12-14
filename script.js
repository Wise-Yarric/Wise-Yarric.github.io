// Адрес вашего развернутого контракта
const contractAddress = "0xf6E4911A995dD038209c02ed94AeA0ceD597CB8D";

// ABI вашего контракта
const contractAbi = [
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_message",
        "type": "string"
      }
    ],
    "name": "setMessage",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getMessage",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

// Ждем загрузки DOM
document.addEventListener('DOMContentLoaded', function() {
  // Проверяем наличие MetaMask
  if (!window.ethereum) {
    alert('Установите MetaMask или другой кошелек.');
    return;
  }

  let contract = null;
  let signer = null;

  // Функция инициализации подключения
  async function initConnection() {
    try {
      // Запрашиваем подключение аккаунтов
      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      });
      
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      signer = provider.getSigner();
      contract = new ethers.Contract(contractAddress, contractAbi, signer);
      
      console.log('Подключено с адресом:', accounts[0]);
      return true;
    } catch (error) {
      console.error('Ошибка подключения:', error);
      
      // Проверяем тип ошибки
      if (error.code === 4001) {
        alert('Вы отклонили запрос на подключение. Пожалуйста, разрешите доступ к MetaMask.');
      } else {
        alert('Ошибка подключения к MetaMask: ' + error.message);
      }
      return false;
    }
  }

  // Кнопка установки сообщения
  document.getElementById('setMessageButton').addEventListener('click', async () => {
    try {
      if (!contract) {
        const connected = await initConnection();
        if (!connected) return;
      }

      const messageInput = document.getElementById('messageInput');
      const message = messageInput.value.trim();
      
      if (!message) {
        alert('Пожалуйста, введите сообщение');
        return;
      }

      // Отображаем индикатор загрузки
      const button = document.getElementById('setMessageButton');
      const originalText = button.textContent;
      button.textContent = 'Отправка...';
      button.disabled = true;

      // Отправляем транзакцию
      const tx = await contract.setMessage(message);
      
      // Ждем подтверждения транзакции
      await tx.wait();
      
      alert('Сообщение успешно установлено!');
      
      // Очищаем поле ввода
      messageInput.value = '';
      
    } catch (error) {
      console.error('Ошибка при установке сообщения:', error);
      
      // Проверяем специфические ошибки
      if (error.code === 'INSUFFICIENT_FUNDS') {
        alert('Недостаточно средств для оплаты газа');
      } else if (error.code === 'ACTION_REJECTED') {
        alert('Транзакция отклонена пользователем');
      } else {
        alert('Ошибка: ' + error.message);
      }
      
    } finally {
      // Восстанавливаем кнопку
      const button = document.getElementById('setMessageButton');
      if (button) {
        button.textContent = 'Установить сообщение';
        button.disabled = false;
      }
    }
  });

  // Кнопка получения сообщения
  document.getElementById('getMessageButton').addEventListener('click', async () => {
    try {
      if (!contract) {
        // Для getMessage не обязательно иметь signer, можем использовать provider
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        contract = new ethers.Contract(contractAddress, contractAbi, provider);
      }

      const message = await contract.getMessage();
      document.getElementById('messageDisplay').textContent = message;
      
    } catch (error) {
      console.error('Ошибка при получении сообщения:', error);
      alert('Не удалось получить сообщение: ' + error.message);
    }
  });

  // Обработчики событий MetaMask
  window.ethereum.on('accountsChanged', (accounts) => {
    if (accounts.length === 0) {
      // Пользователь отключился
      alert('Вы отключили кошелек. Пожалуйста, подключитесь снова.');
      contract = null;
      signer = null;
    } else {
      // Пользователь сменил аккаунт
      console.log('Аккаунт изменен:', accounts[0]);
      // Переинициализируем контракт с новым signer
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      signer = provider.getSigner();
      contract = new ethers.Contract(contractAddress, contractAbi, signer);
    }
  });

  window.ethereum.on('chainChanged', (chainId) => {
    // При смене сети перезагружаем страницу
    console.log('Сеть изменена:', chainId);
    window.location.reload();
  });

  window.ethereum.on('disconnect', (error) => {
    console.log('Отключено от MetaMask:', error);
    contract = null;
    signer = null;
    alert('Отключено от MetaMask');
  });
});
