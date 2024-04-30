<template>
  <div class="wrapper">
    <div class="box">
      <h4>Silahkan panggil nomor antrian dengan klik tombol dibawah</h4>
      <button
        class="call-queue"
        @click="callQueue"
        data-bs-toggle="modal"
        data-bs-target="#queueModal"
      >
        Panggil Antrian
      </button>
      <!-- <span v-if="queueNumber">
        Nomor Antrian Dipanggil: {{ queueNumber }}
      </span> -->
    </div>

    <div
      class="modal fade"
      id="queueModal"
      tabindex="-1"
      aria-labelledby="queueModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div
            class="modal-body d-flex flex-column align-items-center justify-content-center gap-5"
          >
            <span> Nomor Antrian:</span>
            <span> {{ queueNumber }}</span>
            <span>Loket A</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";

export default {
  name: "QueueCaller",
  setup() {
    const queueNumber = ref(null);

    let ws = null;

    function connectWS() {
      ws = new WebSocket("ws://192.168.0.120:8082");
      ws.addEventListener("message", (event) => {
        console.log("Received message:", event.data);
        const data = JSON.parse(event.data);
        if (data.queueNumber) {
          console.log("Queue number received:", data.queueNumber);
          queueNumber.value = data.queueNumber;
        }
      });
    }

    function callQueue() {
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

    return {
      callQueue,
      queueNumber,
    };
  },
};
</script>

<style scoped>
.wrapper {
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
  border: 4px solid green;
  border-radius: 10px;
  padding: 20px;
  gap: 20px;
}

h4 {
  color: green;
  font-weight: 500;
}

.call-queue {
  border: none;
  border-radius: 10px;
  background: green;
  color: #fff;
  padding: 20px 50px;
  font-size: 17px;
  font-weight: 600;
  cursor: pointer;
}

.modal-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.modal-content span:nth-child(2) {
  color: green;
  font-size: 80px;
  font-weight: 600;
}

.modal-content span:nth-child(1),
.modal-content span:nth-child(3) {
  font-size: 30px;
  font-weight: 600;
}
</style>
