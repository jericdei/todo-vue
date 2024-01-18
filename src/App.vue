<script setup lang="ts">
import Button from "primevue/button"
import Column from "primevue/column"
import DataTable from "primevue/datatable"
import DynamicDialog from "primevue/dynamicdialog"
import { onMounted, ref } from "vue"
import { useDialog } from "primevue/usedialog"
import TodoFormModal from "./components/TodoFormModal.vue"
import axios from "axios"

const dialog = useDialog()

export type Todo = {
    id: number
    text: string
    completed: boolean
    created_at: string
}

const todos = ref<Todo[]>([])

onMounted(async () => await fetchTodos())

async function fetchTodos() {
    const response = await axios.get("http://localhost:3000/todos")

    todos.value = response.data.todos
}

function showTodoFormModal(todo?: Todo) {
    dialog.open(TodoFormModal, {
        props: {
            modal: true,
            header: todo ? "Edit Todo" : "Add Todo",
        },
        data: {
            todo,
        },
        onClose: async (options) => {
            if (options?.data && options.data.submitted) {
                await fetchTodos()
            }
        },
    })
}

async function deleteTodo(todoId: number) {
    await axios.delete(`http://localhost:3000/todos/${todoId}`)

    await fetchTodos()
}
</script>

<template>
    <div
        class="grid h-screen w-screen place-items-center bg-slate-900 text-slate-50"
    >
        <DynamicDialog />
        <div class="w-3/4 rounded-xl border-4 p-4">
            <h1 class="text-center text-3xl font-bold">To-do List</h1>

            <div class="flex justify-end">
                <Button
                    label="Add Todo"
                    severity="success"
                    @click="showTodoFormModal()"
                />
            </div>

            <div class="mt-4">
                <DataTable :value="todos">
                    <Column field="id" header="ID" />
                    <Column field="text" header="Todo" />
                    <Column field="completed" header="Completed">
                        <template #body="{ data }">
                            <p>{{ data.completed ? "✔️" : "❌" }}</p>
                        </template>
                    </Column>
                    <Column header="Actions">
                        <template #body="{ data }">
                            <div class="flex items-center gap-4">
                                <Button
                                    label="Edit"
                                    @click="showTodoFormModal(data)"
                                />
                                <Button
                                    label="Delete"
                                    @click="deleteTodo(data.id)"
                                    severity="danger"
                                />
                            </div>
                        </template>
                    </Column>
                </DataTable>
            </div>
        </div>
    </div>
</template>
