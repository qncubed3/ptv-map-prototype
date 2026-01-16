export class Queue {
    constructor(priorityMap = a => a) {
        this.heap = [];
        this.priorityMap = priorityMap;
    }

    pop() {
        if (this.heap.length > 0) {
            this.shift();
        } 
    }
    push(value) {
        this.heap.push(value);
        this.sort();
    }
    sort(){
        this.heap.sort((a, b) => {
            const aTime = new Date(this.priorityMap(a)).getTime();
            const bTime = new Date(this.priorityMap(b)).getTime();
            return aTime - bTime;
        });
    }
    
    toString() {
        return this.heap.map(item => item.toString()).join(", ");
    }
    size() {
        return this.heap.length;
    }
}