// 获取页面元素
const fileInput = document.getElementById('file-input');
const imageOutput = document.getElementById('image-output');
const base64InputBox = document.getElementById('base64-input-box');
const base64Output = document.getElementById('base64-output');
const convertButton = document.getElementById('convert-button');
const imagePreview = document.getElementById('image-preview');
const imageSize = document.getElementById('image-size');

// 监听文件输入框的 change 事件
fileInput.addEventListener('change', (event) => {
  const file = event.target.files[0];
  if (file.type.match('image.*')) {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      imageOutput.src = reader.result;
      base64Output.src = reader.result;
      base64Output.style.display = 'block';
      if (imagePreview !== null) {
        imagePreview.style.display = 'block';
        imagePreview.src = URL.createObjectURL(file);
      }
      if (imageSize !== null) {
        imageSize.innerHTML = `${(file.size / 1024).toFixed(2)} KB`;
      }
    };
  } else {
    alert('请选择图片文件');
  }
});

// 监听粘贴事件
document.addEventListener('paste', (event) => {
  const items = event.clipboardData.items;
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    if (item.type.match('image.*')) {
      const blob = item.getAsFile();
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onload = () => {
        imageOutput.src = reader.result;
        base64Output.src = reader.result;
        base64Output.style.display = 'block';
        if (imagePreview) {
          imagePreview.style.display = 'block';
        }        
        if (imagePreview) {
          imagePreview.src = URL.createObjectURL(blob);
        }
        if (imageSize) {
          imageSize.innerHTML = `${(blob.size / 1024).toFixed(2)} KB`;
        }
      };
    }
  }
});

// 监听转换按钮的点击事件
convertButton.addEventListener('click', () => {
  if (imageOutput.src) {
    const base64 = imageOutput.src.replace(/^data:image\/(png|jpeg|jpg);base64,/, '');
    base64InputBox.value = base64;
  }
  if (base64InputBox.value) {
    base64Output.src = `data:image/png;base64,${base64InputBox.value}`;
    base64Output.style.display = 'block';
    const img = new Image();
    img.src = base64Output.src;
    img.onload = () => {
      imageOutput.src = img.src;
      imageOutput.style.display = 'block';
      if (imageSize !== null) {
        imageSize.innerHTML = `${(base64InputBox.value.length * 0.75 / 1024).toFixed(2)} KB`;
      }
    };
  }
});
