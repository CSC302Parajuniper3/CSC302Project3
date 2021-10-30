export default class ValidationService {
    handleValidateResourceTypeAndId(resourceType, id) {
        let error = null;
        if (!id) {
          error = "Missing id in request";
        } else if (!resourceType) {
          error = "Missing resourceType in request";
        } else if (!VALID_RESOURCE_TYPES.includes(resourceType)) {
          error = `Invalid resourceType: ${resourceType}`;
        }
    
        return error;
    }
}

