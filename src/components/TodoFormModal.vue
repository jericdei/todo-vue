<script setup lang="ts">
import axios from "axios"
import Button from "primevue/button"
import InputSwitch from "primevue/inputswitch"
import InputText from "primevue/inputtext"
import { onMounted, ref } from "vue"
import { useDialogRef } from "../composables/dialog"

const dialogRef = useDialogRef()

onMounted(() => {
    if (dialogRef.value.data.todo) {
        form.value = dialogRef.value.data.todo
    }
})

const form = ref({
    id: undefined,
    text: "",
    completed: false,
})

async function submit() {
    await axios.post("http://localhost:3000/todos", form.value)

    dialogRef.value.close({
        submitted: true,
    })
}
</script>

<template>
    <form class="mt-4 flex flex-col gap-8">
        <InputText v-model="form.text" placeholder="Todo" />

        <div class="flex justify-center gap-4">
            <p>Completed?</p>
            <InputSwitch v-model="form.completed" />
        </div>

        <Button label="Submit" @click="submit()" />
    </form>
</template>
