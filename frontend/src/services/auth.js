import Api from "../services/Api"

export default {
  signup(data) {
    return Api().post("users/signup", data)
  },
  login(data) {
    return Api().post("users/login", data)
  },

  updateUser(id, data) {
    return Api.put("users/profile/" + id, data)
  },
  deleteUser(id) {
    return Api().delete("users/profile/" + id)
  },
  getAllUsers() {
    return Api().get("users/profiles")
  },
  getOneUser(id) {
    return Api().get("users/profile/" + id)
  },
}
