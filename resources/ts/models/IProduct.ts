export interface IProduct {
  id?: string;
  name: string;
  category: string;
  description: string;
  datetime: string;
  product_images?: File[];

  new_images?: File[];
  removed_image_ids?: string[];
}
