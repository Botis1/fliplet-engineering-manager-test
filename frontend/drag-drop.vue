<template>
  <div class="container">
    <div class="header">
      <h3>Drag & Drop Page Builder</h3>
      <div class="toolbar">
        <button class="toolbar-btn" @click="saveDesign">Save</button>
        <button class="toolbar-btn" @click="loadDesign">Load</button>
        <button class="toolbar-btn primary" @click="togglePreviewMode">
          {{ isPreviewMode ? "Exit Preview" : "Preview" }}
        </button>
      </div>
    </div>

    <div class="content" :class="{ 'preview-mode': isPreviewMode }">
      <div class="library" v-if="!isPreviewMode">
        <h4>Components</h4>
        <div
          class="component-card"
          draggable="true"
          @dragstart="dragStart('Text')"
        >
          <span class="component-icon">T</span>
          <span>Text</span>
        </div>
        <div
          class="component-card"
          draggable="true"
          @dragstart="dragStart('Button')"
        >
          <span class="component-icon">B</span>
          <span>Button</span>
        </div>
        <div
          class="component-card"
          draggable="true"
          @dragstart="dragStart('Image')"
        >
          <span class="component-icon">I</span>
          <span>Image</span>
        </div>
        <div
          class="component-card"
          draggable="true"
          @dragstart="dragStart('Form')"
        >
          <span class="component-icon">F</span>
          <span>Form</span>
        </div>
      </div>

      <div class="preview-container" :class="{ expanded: isPreviewMode }">
        <div
          class="preview"
          @drop="drop"
          @dragover="dragOver"
          @dragenter.prevent
          @dragleave="dragLeave"
        >
          <div
            v-for="(component, index) in components"
            :key="index"
            class="dropped-component"
            :class="{ selected: selectedIndex === index && !isPreviewMode }"
            :style="{
              left: component.x + 'px',
              top: component.y + 'px',
              width: component.width ? component.width + 'px' : 'auto',
              height: component.height ? component.height + 'px' : 'auto',
            }"
            @click.stop="isPreviewMode ? null : selectComponent(index)"
            @mousedown="isPreviewMode ? null : startDrag($event, index)"
          >
            <div class="component-wrapper">
              <button
                v-if="component.type === 'Button'"
                class="preview-button"
                :style="{
                  backgroundColor: component.bgColor,
                  color: component.textColor,
                }"
              >
                {{ component.label || "Button" }}
              </button>

              <p
                v-else-if="component.type === 'Text'"
                class="preview-text"
                :style="{
                  fontSize: component.fontSize + 'px',
                  color: component.color,
                }"
              >
                {{ component.content || "Sample Text" }}
              </p>

              <div v-else-if="component.type === 'Image'" class="preview-image">
                <img
                  v-if="component.imageUrl"
                  :src="component.imageUrl"
                  :alt="component.altText"
                  style="max-width: 100%; max-height: 100%"
                />
                <div v-else class="image-placeholder">Image</div>
              </div>

              <div v-else-if="component.type === 'Form'" class="preview-form">
                <input
                  :type="component.inputType || 'text'"
                  :placeholder="component.placeholder || 'Form input'"
                />
              </div>
            </div>
            <div
              class="component-controls"
              v-if="selectedIndex === index && !isPreviewMode"
            >
              <button @click.stop="removeComponent(index)" class="remove-btn">
                ×
              </button>
            </div>
            <div
              v-if="selectedIndex === index && !isPreviewMode"
              class="resize-handle"
              @mousedown.stop="startResize($event, index)"
            ></div>
          </div>
        </div>
      </div>

      <div
        class="properties-panel"
        v-if="selectedIndex !== null && !isPreviewMode"
      >
        <h4>Properties</h4>
        <div class="property">
          <label>Position X:</label>
          <input type="number" v-model.number="components[selectedIndex].x" />
        </div>
        <div class="property">
          <label>Position Y:</label>
          <input type="number" v-model.number="components[selectedIndex].y" />
        </div>
        <div class="property">
          <label>Width:</label>
          <input
            type="number"
            v-model.number="components[selectedIndex].width"
            min="50"
          />
        </div>
        <div class="property">
          <label>Height:</label>
          <input
            type="number"
            v-model.number="components[selectedIndex].height"
            min="30"
          />
        </div>
        <template v-if="components[selectedIndex].type === 'Text'">
          <div class="property-divider">Text Properties</div>
          <div class="property">
            <label>Content:</label>
            <input
              type="text"
              v-model="components[selectedIndex].content"
              placeholder="Text content"
            />
          </div>
          <div class="property">
            <label>Font Size:</label>
            <input
              type="number"
              v-model.number="components[selectedIndex].fontSize"
              placeholder="16"
            />
          </div>
          <div class="property">
            <label>Color:</label>
            <input type="color" v-model="components[selectedIndex].color" />
          </div>
        </template>
        <template v-if="components[selectedIndex].type === 'Button'">
          <div class="property-divider">Button Properties</div>
          <div class="property">
            <label>Label:</label>
            <input
              type="text"
              v-model="components[selectedIndex].label"
              placeholder="Button"
            />
          </div>
          <div class="property">
            <label>Background:</label>
            <input type="color" v-model="components[selectedIndex].bgColor" />
          </div>
          <div class="property">
            <label>Text Color:</label>
            <input type="color" v-model="components[selectedIndex].textColor" />
          </div>
        </template>
        <template v-if="components[selectedIndex].type === 'Image'">
          <div class="property-divider">Image Properties</div>
          <div class="property">
            <label>Image URL:</label>
            <input
              type="text"
              v-model="components[selectedIndex].imageUrl"
              placeholder="https://example.com/image.jpg"
            />
          </div>
          <div class="property">
            <label>Alt Text:</label>
            <input
              type="text"
              v-model="components[selectedIndex].altText"
              placeholder="Image description"
            />
          </div>
        </template>
        <template v-if="components[selectedIndex].type === 'Form'">
          <div class="property-divider">Form Properties</div>
          <div class="property">
            <label>Input Type:</label>
            <select v-model="components[selectedIndex].inputType">
              <option value="text">Text</option>
              <option value="email">Email</option>
              <option value="password">Password</option>
              <option value="number">Number</option>
            </select>
          </div>
          <div class="property">
            <label>Placeholder:</label>
            <input
              type="text"
              v-model="components[selectedIndex].placeholder"
              placeholder="Enter placeholder text"
            />
          </div>
        </template>
      </div>
    </div>

    <!-- Save/Load Modals -->
    <div
      class="modal-backdrop"
      v-if="showSaveModal || showLoadModal"
      @click="closeModals"
    ></div>

    <div class="modal" v-if="showSaveModal">
      <h4>Save Design</h4>
      <div class="form-group">
        <label>Design Name:</label>
        <input type="text" v-model="designName" placeholder="My Design" />
      </div>
      <div class="modal-actions">
        <button @click="closeModals">Cancel</button>
        <button class="primary" @click="confirmSave">Save</button>
      </div>
    </div>

    <div class="modal" v-if="showLoadModal">
      <h4>Load Design</h4>
      <div v-if="savedDesigns.length === 0" class="no-designs">
        No saved designs found.
      </div>
      <div v-else class="saved-designs">
        <div
          v-for="design in savedDesigns"
          :key="design.name"
          class="saved-design"
          @click="loadDesignData(design)"
        >
          <span>{{ design.name }}</span>
          <span class="design-date">{{ formatDate(design.date) }}</span>
        </div>
      </div>
      <div class="modal-actions">
        <button @click="closeModals">Cancel</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      components: [],
      selectedIndex: null,
      isDraggingOver: false,
      isDragging: false,
      isResizing: false,
      startX: 0,
      startY: 0,
      originalX: 0,
      originalY: 0,
      originalWidth: 0,
      originalHeight: 0,
      isPreviewMode: false,
      showSaveModal: false,
      showLoadModal: false,
      designName: "",
      savedDesigns: [],
    };
  },
  mounted() {
    document.addEventListener("mousemove", this.onMouseMove);
    document.addEventListener("mouseup", this.onMouseUp);

    // Load previously saved designs
    this.loadSavedDesigns();
  },
  beforeDestroy() {
    document.removeEventListener("mousemove", this.onMouseMove);
    document.removeEventListener("mouseup", this.onMouseUp);
  },
  methods: {
    dragStart(type) {
      event.dataTransfer.setData("text/plain", type);
      event.dataTransfer.effectAllowed = "copy";
    },
    dragOver(event) {
      event.preventDefault();
      this.isDraggingOver = true;
      event.currentTarget.classList.add("drag-over");
    },
    dragLeave(event) {
      this.isDraggingOver = false;
      event.currentTarget.classList.remove("drag-over");
    },
    drop(event) {
      event.preventDefault();
      this.isDraggingOver = false;
      event.currentTarget.classList.remove("drag-over");

      const type = event.dataTransfer.getData("text/plain");
      const rect = event.target.getBoundingClientRect();

      // Calculate position relative to the drop zone
      let x = event.clientX - rect.left;
      let y = event.clientY - rect.top;

      // If dropped on an existing component, use the preview area as reference
      if (event.target.className !== "preview") {
        const previewRect = this.$el
          .querySelector(".preview")
          .getBoundingClientRect();
        x = event.clientX - previewRect.left;
        y = event.clientY - previewRect.top;
      }

      // Create component with default properties
      const newComponent = {
        type,
        x,
        y,
        width: null,
        height: null,
      };

      // Add component-specific properties
      if (type === "Text") {
        newComponent.content = "Sample Text";
        newComponent.fontSize = 16;
        newComponent.color = "#000000";
      } else if (type === "Button") {
        newComponent.label = "Button";
        newComponent.bgColor = "#4d90fe";
        newComponent.textColor = "#ffffff";
      } else if (type === "Image") {
        newComponent.imageUrl = "";
        newComponent.altText = "Image description";
      } else if (type === "Form") {
        newComponent.inputType = "text";
        newComponent.placeholder = "Form input";
      }

      this.components.push(newComponent);
      this.selectedIndex = this.components.length - 1;
    },
    selectComponent(index) {
      this.selectedIndex = index;
    },
    removeComponent(index) {
      this.components.splice(index, 1);
      this.selectedIndex = null;
    },
    startDrag(event, index) {
      if (this.selectedIndex !== index) {
        this.selectComponent(index);
      }

      this.isDragging = true;
      this.startX = event.clientX;
      this.startY = event.clientY;
      this.originalX = this.components[index].x;
      this.originalY = this.components[index].y;

      event.preventDefault();
    },
    startResize(event, index) {
      this.isResizing = true;
      this.startX = event.clientX;
      this.startY = event.clientY;

      const component = this.components[index];

      // Initialize width/height if not set
      if (!component.width) {
        const el = event.target.parentElement;
        component.width = el.offsetWidth;
      }

      if (!component.height) {
        const el = event.target.parentElement;
        component.height = el.offsetHeight;
      }

      this.originalWidth = component.width;
      this.originalHeight = component.height;

      event.preventDefault();
    },
    onMouseMove(event) {
      if (this.isDragging && this.selectedIndex !== null) {
        const dx = event.clientX - this.startX;
        const dy = event.clientY - this.startY;

        this.components[this.selectedIndex].x = this.originalX + dx;
        this.components[this.selectedIndex].y = this.originalY + dy;
      }

      if (this.isResizing && this.selectedIndex !== null) {
        const dx = event.clientX - this.startX;
        const dy = event.clientY - this.startY;

        const newWidth = Math.max(50, this.originalWidth + dx);
        const newHeight = Math.max(30, this.originalHeight + dy);

        this.components[this.selectedIndex].width = newWidth;
        this.components[this.selectedIndex].height = newHeight;
      }
    },
    onMouseUp() {
      this.isDragging = false;
      this.isResizing = false;
    },
    togglePreviewMode() {
      this.isPreviewMode = !this.isPreviewMode;
      if (this.isPreviewMode) {
        this.selectedIndex = null;
      }
    },
    saveDesign() {
      this.showSaveModal = true;
    },
    confirmSave() {
      if (!this.designName.trim()) {
        alert("Please enter a design name");
        return;
      }

      const design = {
        name: this.designName,
        components: JSON.parse(JSON.stringify(this.components)),
        date: new Date().toISOString(),
      };

      // Load existing designs
      let designs = this.getSavedDesigns();

      // Check for duplicate names
      const existingIndex = designs.findIndex((d) => d.name === design.name);
      if (existingIndex >= 0) {
        designs[existingIndex] = design;
      } else {
        designs.push(design);
      }

      // Save back to localStorage
      localStorage.setItem("savedDesigns", JSON.stringify(designs));

      // Update local state
      this.savedDesigns = designs;

      // Close modal
      this.closeModals();
    },
    loadDesign() {
      this.loadSavedDesigns();
      this.showLoadModal = true;
    },
    loadDesignData(design) {
      this.components = JSON.parse(JSON.stringify(design.components));
      this.closeModals();
    },
    getSavedDesigns() {
      try {
        return JSON.parse(localStorage.getItem("savedDesigns")) || [];
      } catch (e) {
        console.error("Error loading saved designs", e);
        return [];
      }
    },
    loadSavedDesigns() {
      this.savedDesigns = this.getSavedDesigns();
    },
    closeModals() {
      this.showSaveModal = false;
      this.showLoadModal = false;
    },
    formatDate(dateString) {
      const date = new Date(dateString);
      return date.toLocaleDateString();
    },
  },
};
</script>

<style>
.container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  background-color: #f8f8f8;
  border-bottom: 1px solid #e0e0e0;
}

.toolbar {
  display: flex;
  gap: 10px;
}

.toolbar-btn {
  padding: 8px 15px;
  background: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
}

.toolbar-btn.primary {
  background: #4d90fe;
  color: white;
  border-color: #4d90fe;
}

.content {
  display: grid;
  grid-template-columns: 200px 1fr 250px;
  gap: 20px;
  padding: 20px;
  flex: 1;
  overflow: hidden;
}

.content.preview-mode {
  grid-template-columns: 0fr 1fr 0fr;
}

.library {
  display: flex;
  flex-direction: column;
  gap: 10px;
  background-color: #f5f5f5;
  padding: 15px;
  border-radius: 8px;
  max-height: calc(100vh - 100px);
  overflow-y: auto;
}

.library h4 {
  margin-top: 0;
  margin-bottom: 10px;
}

.preview-container {
  position: relative;
  height: 100%;
  transition: all 0.3s ease;
}

.preview-container.expanded {
  margin: 0 auto;
  max-width: 1000px;
  width: 100%;
}

.component-card {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  background: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: grab;
  transition: all 0.2s;
}

.component-card:hover {
  background: #f0f0f0;
  transform: translateY(-2px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.component-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  background: #e0e0e0;
  border-radius: 4px;
  font-weight: bold;
}

.preview {
  position: relative;
  min-height: 600px;
  border: 2px dashed #ccc;
  border-radius: 8px;
  padding: 20px;
  background: white;
  overflow: hidden;
}

.preview.drag-over {
  border-color: #4d90fe;
  background-color: rgba(77, 144, 254, 0.05);
}

.dropped-component {
  position: absolute;
  cursor: move;
  user-select: none;
  min-width: 50px;
  min-height: 30px;
}

.component-wrapper {
  padding: 5px;
}

.selected {
  outline: 2px solid #4d90fe;
  z-index: 10;
}

.component-controls {
  position: absolute;
  top: -15px;
  right: -15px;
  display: flex;
  gap: 5px;
}

.remove-btn {
  width: 22px;
  height: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: red;
  color: white;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  font-size: 16px;
  line-height: 1;
  padding: 0;
}

.properties-panel {
  background: #f5f5f5;
  padding: 15px;
  border-radius: 8px;
  overflow-y: auto;
}

.property {
  margin-bottom: 15px;
}

.property label {
  display: block;
  margin-bottom: 5px;
  font-size: 14px;
}

.property input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

/* Component styles */
.preview-button {
  padding: 8px 16px;
  background: #4d90fe;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.preview-text {
  margin: 0;
  padding: 8px;
  min-width: 100px;
}

.preview-image {
  width: 150px;
  height: 100px;
  background: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px dashed #ccc;
}

.preview-form {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: white;
}

.preview-form input {
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  width: 200px;
}

.resize-handle {
  position: absolute;
  width: 10px;
  height: 10px;
  bottom: 0;
  right: 0;
  background: #4d90fe;
  cursor: nwse-resize;
}

.property-divider {
  margin: 15px 0;
  font-weight: bold;
  padding-bottom: 5px;
  border-bottom: 1px solid #ddd;
}

/* Modal styles */
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 100;
}

.modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  border-radius: 8px;
  padding: 20px;
  min-width: 400px;
  z-index: 101;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

.modal h4 {
  margin-top: 0;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
}

.form-group input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}

.modal-actions button {
  padding: 8px 15px;
  background: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
}

.modal-actions button.primary {
  background: #4d90fe;
  color: white;
  border-color: #4d90fe;
}

.saved-designs {
  max-height: 300px;
  overflow-y: auto;
}

.saved-design {
  display: flex;
  justify-content: space-between;
  padding: 10px;
  border-bottom: 1px solid #eee;
  cursor: pointer;
}

.saved-design:hover {
  background: #f5f5f5;
}

.design-date {
  color: #777;
  font-size: 0.9em;
}

.no-designs {
  padding: 20px;
  text-align: center;
  color: #777;
}
</style>
