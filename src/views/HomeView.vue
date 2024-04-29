<template>
  <div class="home">
    <div class="box">
      <h4>Silahkan ambil nomor antrian dengan klik tombol dibawah</h4>
      <button class="take-queue" @click="takeQueue">Ambil Antrian</button>
      <div v-if="popUp" class="queue-popup">
        <div class="queue-value">
          <span v-if="!queueNumberPopup">Mohon Menunggu...</span>
          <span v-else> Nomor Antrian: {{ queueNumberPopup }} </span>
          <button class="close-popup" @click="closePopUp">Tutup</button>
        </div>
      </div>
      <router-link to="/queue-caller" class="call-queue">
        Ke halaman panggil antrian
      </router-link>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";

export default {
  name: "HomeView",
  setup() {
    const popUp = ref(false);
    const queueNumberPopup = ref(null);
    let ws = null;

    function connectWS() {
      ws = new WebSocket("ws://192.168.0.120:8082");
      ws.addEventListener("message", (event) => {
        console.log("Received message:", event.data);
        const data = JSON.parse(event.data);
        if (data.queueNumber) {
          console.log("Queue number received:", data.queueNumber);
          queueNumberPopup.value = data.queueNumber;
        }
      });
    }

    function takeQueue() {
      popUp.value = true;
      console.log("Taking queue...");
      if (!ws || ws.readyState !== WebSocket.OPEN) {
        connectWS();
        setTimeout(() => {
          if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ action: "requestQueueNumber" }));
          } else {
            console.error("WebSocket connection not open.");
          }
        }, 1000);
      } else {
        ws.send(JSON.stringify({ action: "requestQueueNumber" }));
      }
    }

    function closePopUp() {
      popUp.value = false;
    }
    return {
      connectWS,
      takeQueue,
      queueNumberPopup,
      closePopUp,
      popUp,
    };
  },
};
</script>

<style scoped>
.home {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}
.box {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border: 4px solid cadetblue;
  border-radius: 10px;
  padding: 20px;
  gap: 20px;
}

h4 {
  color: cadetblue;
  font-weight: 500;
}

.take-queue {
  border: none;
  border-radius: 10px;
  background: cadetblue;
  color: #fff;
  padding: 20px 50px;
  font-size: 17px;
  font-weight: 600;
  cursor: pointer;
}

.queue-popup {
  position: absolute;
  width: 100%;
  height: 100%;
  background: #dedede;
}

.queue-value {
  background: #fff;
  border-radius: 10px;
  width: 40%;
  height: 40%;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 99999;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
}

.close-popup {
  border: none;
  border-radius: 10px;
  background: cadetblue;
  color: #fff;
  padding: 20px 50px;
  font-size: 17px;
  font-weight: 600;
  cursor: pointer;
}
</style>
