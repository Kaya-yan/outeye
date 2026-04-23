// 告诉 TypeScript："CSS 文件是可以导入的，不用报错"
declare module "*.css" {
  const content: { [className: string]: string };
  export default content;
}