import React, { createContext, useState, useEffect, useContext } from 'react';
import initialProductData from '../data/Tab1-ProductFeed.json';
import initialECommerceData from '../data/Tab2-eCommerce.json';
import { generateRowId } from '../utils/idUtils.js';
import { useLog } from './LogContext';

const DataContext = createContext();

export const useData = () => useContext(DataContext);

export const DataProvider = ({ children }) => {
  const [productData, setProductData] = useState([]);
  const [eCommerceData, setECommerceData] = useState([]);
  const { addLogEntry } = useLog();

  useEffect(() => {
    const validProductDataWithIds = initialProductData
      .filter(row => row['RETAILER'] && String(row['RETAILER']).trim() !== '')
      .map(row => ({ ...row, _id: generateRowId() }));
    setProductData(validProductDataWithIds);

    const validECommerceDataWithIds = initialECommerceData
      .filter(row => Object.values(row).some(val => val !== null && String(val).trim() !== ''))
      .map(row => ({...row, _id: generateRowId() }));
    setECommerceData(validECommerceDataWithIds);
  }, []);

  const addProductItem = (newItem) => {
    const itemWithId = { ...newItem, _id: generateRowId() };
    setProductData(prevData => [...prevData, itemWithId]);
    addLogEntry('PRODUCT_CATALOG_ADD', itemWithId._id, { RETAILER: itemWithId.RETAILER, newItemData: itemWithId });
  };

  const updateProductItem = (itemId, updatedItemData) => {
    let oldItem = null;
    setProductData(prevData => {
      const newData = prevData.map(item => {
        if (item._id === itemId) {
          oldItem = { ...item };
          return { ...item, ...updatedItemData, _id: itemId };
        }
        return item;
      });
      return newData;
    });
    if (oldItem) {
      addLogEntry('PRODUCT_CATALOG_UPDATE', itemId, { RETAILER: updatedItemData.RETAILER || oldItem.RETAILER, updatedFields: updatedItemData, oldItemData: oldItem });
    }
  };

  const deleteProductItem = (itemId) => {
    let deletedItem = null;
    setProductData(prevData => prevData.filter(item => {
      if (item._id === itemId) {
        deletedItem = item;
        return false;
      }
      return true;
    }));
    if (deletedItem) {
      addLogEntry('PRODUCT_CATALOG_DELETE', itemId, { RETAILER: deletedItem.RETAILER, deletedItemData: deletedItem });
    }
  };

  const addECommerceItem = (newItem) => {
    const itemWithId = { ...newItem, _id: generateRowId() };
    setECommerceData(prevData => [...prevData, itemWithId]);
    addLogEntry('ECOMMERCE_ADD', itemWithId._id, { RETAILER: itemWithId.RETAILER, newItemData: itemWithId });
  };

  const updateECommerceItem = (itemId, updatedItemData) => {
    let oldItem = null;
    setECommerceData(prevData => {
      const newData = prevData.map(item => {
        if (item._id === itemId) {
          oldItem = { ...item };
          return { ...item, ...updatedItemData, _id: itemId };
        }
        return item;
      });
      return newData;
    });
    if (oldItem) {
      addLogEntry('ECOMMERCE_UPDATE', itemId, { RETAILER: updatedItemData.RETAILER || oldItem.RETAILER, updatedFields: updatedItemData, oldItemData: oldItem });
    }
  };

  const deleteECommerceItem = (itemId) => {
    let deletedItem = null;
    setECommerceData(prevData => prevData.filter(item => {
      if (item._id === itemId) {
        deletedItem = item;
        return false;
      }
      return true;
    }));
    if (deletedItem) {
      addLogEntry('ECOMMERCE_DELETE', itemId, { RETAILER: deletedItem.RETAILER, deletedItemData: deletedItem });
    }
  };

  const value = {
    productData,
    eCommerceData,
    setProductData,
    setECommerceData,
    addProductItem,
    updateProductItem,
    deleteProductItem,
    addECommerceItem,
    updateECommerceItem,
    deleteECommerceItem,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}; 