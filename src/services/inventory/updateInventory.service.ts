import { AppError } from "../../errors/appError";
import { IInventoryUpdate } from "../../interfaces/inventory";
import {
  listInventoryRepository,
  updateInventoryRepository,
} from "../../repositories/inventory";

const updateInventoryService = async ({
  id,
  type_order,
  data,
}: IInventoryUpdate) => {
  const inventories = await listInventoryRepository();

  const inventoryAlreadyExists = inventories.find(
    (user: any) => user.id === id
  );

  if (!inventoryAlreadyExists) {
    throw new AppError("Inventory not found!", 404);
  }
  if (!type_order) {
    throw new AppError("Input a valid type!", 404);
  }

  if (type_order === "input") {
    const newQuantity = inventoryAlreadyExists.quantity + Number(data.quantity);

    const totalValueInput = data.quantity * data.unitary_value!;
    const newTotalValue = inventoryAlreadyExists.total_value + totalValueInput;

    const newUnitaryValue = newTotalValue / newQuantity;
    // data.unitary_value
    //   ? data.unitary_value
    //   : inventoryAlreadyExists.unitary_value;

    const newData = {
      quantity: newQuantity,
      unitary_value: newUnitaryValue,
      total_value: newTotalValue,
    };

    const updateInventory = await updateInventoryRepository({ id, newData });
    return updateInventory;
  }

  if (type_order === "output") {
    const newQuantity = inventoryAlreadyExists.quantity - Number(data.quantity);
    const newTotalValue = newQuantity * inventoryAlreadyExists.unitary_value;
    // data.unitary_value
    //   ? data.unitary_value
    //   : inventoryAlreadyExists.unitary_value;

    const newData = {
      quantity: newQuantity,
      total_value: newTotalValue,
    };

    const updateInventory = await updateInventoryRepository({ id, newData });
    return updateInventory;
  }
};

export default updateInventoryService;
