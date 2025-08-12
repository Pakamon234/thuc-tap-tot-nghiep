import apiClient from './api'; // Assuming api.js is in the same directory

// Services Client API
export const servicesService = {
getServices: async (filters = {}) => {
  try {
    const response = await apiClient.get('/dichvu', { params: filters });

    // Log the full response to inspect its structure
    console.log('API Response: ', response); // Log the full response to check structure
    return response; // Return only the data part
  } catch (error) {
    throw new Error(`Failed to fetch services: ${error.message}`);
  }
},

  getServiceDetails: async (serviceId) => {
    try {
      const response = await apiClient.get(`/dichvu/${serviceId}`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch service details: ${error.message}`);
    }
  },
  createService: async (serviceData) => {
    try {
      const response = await apiClient.post('/dichvu', serviceData);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to create service: ${error.message}`);
    }
  },
  updateService: async (serviceId, serviceData) => {
    try {
      const response = await apiClient.put(`/dichvu/${serviceId}`, serviceData);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to update service: ${error.message}`);
    }
  },
  deleteService: async (serviceId) => {
    try {
      const response = await apiClient.delete(`/dichvu/${serviceId}`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to delete service: ${error.message}`);
    }
  },
  updateServiceStatus: async (serviceId, status) => {
    try {
      const response = await apiClient.patch(`/dichvu/${serviceId}/status`, { status });
      return response.data;
    } catch (error) {
      throw new Error(`Failed to update service status: ${error.message}`);
    }
  },
  getServiceStats: async () => {
    try {
      const response = await apiClient.get('/dichvu/stats');
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch service stats: ${error.message}`);
    }
  },
};

// Service Configuration Client API
export const serviceConfigurationService = {
  getServiceConfigurations: async (serviceId) => {
    try {
      const response = await apiClient.get(`/cauhinhdichvu/${serviceId}`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch service configurations: ${error.message}`);
    }
  },
  createServiceConfiguration: async (serviceId, configurationData) => {
    try {
      const response = await apiClient.post(`/cauhinhdichvu/${serviceId}`, configurationData);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to create service configuration: ${error.message}`);
    }
  },
  deleteServiceConfiguration: async (configId) => {
    try {
      const response = await apiClient.delete(`cauhinhdichvu/${configId}`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to delete service configuration: ${error.message}`);
    }
  },
};

// Fee Parameters Client API
export const feeParametersService = {
  getFeeParameters: async (configurationId) => {
    try {
      const response = await apiClient.get(`/thamsophi/${configurationId}`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch fee parameters: ${error.message}`);
    }
  },
  createFeeParameter: async (configurationId, feeData) => {
    try {
      const response = await apiClient.post(`/thamsophi/${configurationId}`, feeData);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to create fee parameter: ${error.message}`);
    }
  },
  deleteFeeParameter: async (feeParameterId) => {
    try {
      const response = await apiClient.delete(`/thamsophi/${feeParameterId}`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to delete fee parameter: ${error.message}`);
    }
  },
};

// Service Packages Client API
export const servicePackagesService = {
  getServicePackages: async (serviceId) => {
    try {
      const response = await apiClient.get(`/goicuocdichvu/${serviceId}`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch service packages: ${error.message}`);
    }
  },
  createServicePackage: async (serviceId, packageData) => {
    try {
      const response = await apiClient.post(`/goicuocdichvu/${serviceId}`, packageData);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to create service package: ${error.message}`);
    }
  },
  deleteServicePackage: async (packageId) => {
    try {
      const response = await apiClient.delete(`/goicuocdichvu/${packageId}`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to delete service package: ${error.message}`);
    }
  },
};
