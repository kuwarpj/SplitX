import { Feather } from "@expo/vector-icons";
import { useCallback, useState } from "react";
import {
    FlatList,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
// Using react-native-feather as Lucide alternative
import Routes from "@/constants/ApiRoutes";
import { fetchAPI } from "@/utils/fetchAPI";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { lightThemeColors } from "../constants/Colors"; // Import your light theme colors

interface Contact {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}
interface FormErrors {
  groupName?: string;
  members?: string;
}
const CreateGroup = ({ navigation }) => {
  const [groupName, setGroupName] = useState("");
  const [description, setDescription] = useState("");
  const [memberEmails, setMemberEmails] = useState([""]);
  const [showContactModal, setShowContactModal] = useState(false);
  const [activeEmailIndex, setActiveEmailIndex] = useState<number | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  // Mock contacts data
  const contacts: Contact[] = [
    { id: "1", name: "John Doe", email: "john.doe@email.com", avatar: "👨" },
    {
      id: "2",
      name: "Sarah Smith",
      email: "sarah.smith@email.com",
      avatar: "👩",
    },
    {
      id: "3",
      name: "Mike Johnson",
      email: "mike.johnson@email.com",
      avatar: "👨‍💼",
    },
    {
      id: "4",
      name: "Emily Brown",
      email: "emily.brown@email.com",
      avatar: "👩‍💼",
    },
    {
      id: "5",
      name: "David Wilson",
      email: "david.wilson@email.com",
      avatar: "👨‍🎓",
    },
    {
      id: "6",
      name: "Lisa Anderson",
      email: "lisa.anderson@email.com",
      avatar: "👩‍🎓",
    },
  ];

  const addEmailField = () => {
    setMemberEmails([...memberEmails, ""]);
  };

  const removeEmailField = (index: number) => {
    if (memberEmails.length > 1) {
      const newEmails = memberEmails.filter((_, i) => i !== index);
      setMemberEmails(newEmails);
    }
  };

  const updateEmail = (index: number, value: string) => {
    const newEmails = [...memberEmails];
    newEmails[index] = value;
    setMemberEmails(newEmails);
  };

  const openContactModal = (index: number) => {
    setActiveEmailIndex(index);
    setShowContactModal(true);
  };

  const selectContact = (contact: Contact) => {
    if (activeEmailIndex !== null) {
      updateEmail(activeEmailIndex, contact.email);
    }
    setShowContactModal(false);
    setActiveEmailIndex(null);
  };

  const validateForm = () => {
    const newErrors: FormErrors = {};

    if (!groupName.trim()) {
      newErrors.groupName = "Group name is required";
    }

    const validEmails = memberEmails.filter((email) => email.trim() !== "");
    if (validEmails.length === 0) {
      newErrors.members = "At least one member is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = useCallback(async () => {
    try {
      if (validateForm()) {
        const payload = {
          groupName: groupName.trim(),
          groupDesc: description.trim(),
          members: memberEmails
            .filter((email) => email.trim() !== "")
            .map((email) => ({ email: email.trim() })),
        };

        const data = await fetchAPI(Routes?.CREATE_GROUP, "POST", payload);
        if (data?.success === true) {
          Toast.show({
            type: "success",
            text1: "Group Created Successfully!",
          });

          navigation.goBack();
        }
      }
    } catch (error) {
      console.log(error);
    }
  }, [groupName, description, memberEmails]);
  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: lightThemeColors.background }}
      edges={["top", "left", "right"]}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Feather name="arrow-left" size={24} color="gray" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Create Group</Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* Form Content */}
        <ScrollView style={styles.content}>
          {/* Group Name */}
          <View style={styles.card}>
            <Text style={styles.label}>Group Name</Text>
            <TextInput
              value={groupName}
              onChangeText={(text) => {
                setGroupName(text);
                if (errors.groupName)
                  setErrors((prev) => ({ ...prev, groupName: "" }));
              }}
              placeholder="Enter group name"
              style={[
                styles.input,
                errors.groupName ? styles.inputError : null,
              ]}
              placeholderTextColor={lightThemeColors.mutedForeground}
            />
            {errors.groupName ? (
              <Text style={styles.errorText}>{errors.groupName}</Text>
            ) : null}
          </View>

          {/* Description */}
          <View style={styles.card}>
            <Text style={styles.label}>Description (Optional)</Text>
            <TextInput
              value={description}
              onChangeText={setDescription}
              placeholder="Enter group description"
              style={[styles.input, styles.descriptionInput]}
              multiline
              numberOfLines={3}
              placeholderTextColor={lightThemeColors.mutedForeground}
            />
          </View>

          {/* Members */}
          <View style={styles.card}>
            <View style={styles.membersHeader}>
              <Text style={styles.label}>Add Members</Text>
              <TouchableOpacity
                onPress={addEmailField}
                style={styles.addButton}
              >
                <Feather
                  name="plus-circle"
                  color={lightThemeColors.primary}
                  width={16}
                  height={16}
                />
                <Text style={styles.addButtonText}>Add</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.emailFieldsContainer}>
              {memberEmails.map((email, index) => (
                <>
                  <View key={index} style={styles.emailFieldRow}>
                    <View style={styles.emailInputContainer}>
                      color={lightThemeColors.mutedForeground}
                      <Feather name="mail" size={20} style={styles.emailIcon} />
                      <TextInput
                        value={email}
                        // onChangeText={(text) => updateEmail(index, text)}
                        onChangeText={(text) => {
                          const newEmails = [...memberEmails];
                          newEmails[index] = text;
                          setMemberEmails(newEmails);
                          if (errors.members)
                            setErrors((prev) => ({ ...prev, members: "" }));
                        }}
                        placeholder="Enter email address"
                        style={[
                          styles.emailInput,
                          errors.members && index === 0
                            ? styles.inputError
                            : null,
                        ]}
                        placeholderTextColor={lightThemeColors.mutedForeground}
                        keyboardType="email-address"
                      />
                      <TouchableOpacity
                        onPress={() => openContactModal(index)}
                        style={styles.contactButton}
                      >
                        <Feather
                          name="users"
                          color={lightThemeColors.mutedForeground}
                          width={20}
                          height={20}
                        />
                      </TouchableOpacity>
                    </View>
                    {memberEmails.length > 1 && (
                      <TouchableOpacity
                        onPress={() => removeEmailField(index)}
                        style={styles.removeButton}
                      >
                        <Feather
                          name="x"
                          size={20}
                          color={lightThemeColors.foreground}
                        />
                      </TouchableOpacity>
                    )}
                  </View>
                  {errors.members ? (
                    <Text style={styles.errorText}>{errors.members}</Text>
                  ) : null}
                </>
              ))}
            </View>
          </View>

          {/* Submit Button */}
          <TouchableOpacity onPress={handleSubmit} style={styles.submitButton}>
            <Text style={styles.submitButtonText}>Create Group</Text>
          </TouchableOpacity>
        </ScrollView>

        {/* Contact Selection Modal */}
        <Modal
          visible={showContactModal}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setShowContactModal(false)}
        >
          <View style={styles.modalOverlay}>
            <TouchableOpacity
              style={styles.modalBackground}
              activeOpacity={1}
              onPress={() => setShowContactModal(false)}
            />
            <View style={styles.modalContent}>
              <View style={styles.modalHandle} />
              <View style={styles.modalHeader}>
                <Feather
                  name="users"
                  color={lightThemeColors.primary}
                  width={20}
                  height={20}
                />
                <Text style={styles.modalTitle}>Select Contact</Text>
              </View>

              <FlatList
                data={contacts}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() => selectContact(item)}
                    style={styles.contactItem}
                  >
                    <View style={styles.contactAvatar}>
                      <Text style={styles.avatarText}>{item.avatar}</Text>
                    </View>
                    <View style={styles.contactInfo}>
                      <Text style={styles.contactName}>{item.name}</Text>
                      <Text style={styles.contactEmail}>{item.email}</Text>
                    </View>
                  </TouchableOpacity>
                )}
                style={styles.contactsList}
              />

              <TouchableOpacity
                onPress={() => setShowContactModal(false)}
                style={styles.cancelButton}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: lightThemeColors.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    paddingTop: 0,
    backgroundColor: lightThemeColors.background,
    borderBottomWidth: 1,
    borderBottomColor: lightThemeColors.border,
  },
  backButton: {
    // padding: 8,
    // marginLeft: -8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: lightThemeColors.foreground,
  },
  headerSpacer: {
    width: 40,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  card: {
    backgroundColor: lightThemeColors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: lightThemeColors.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: lightThemeColors.foreground,
    marginBottom: 8,
  },
  input: {
    backgroundColor: lightThemeColors.card,
    borderWidth: 1,
    borderColor: lightThemeColors.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: lightThemeColors.foreground,
  },
  descriptionInput: {
    height: 100,
    textAlignVertical: "top",
  },
  membersHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  addButtonText: {
    fontSize: 14,
    fontWeight: "500",
    color: lightThemeColors.primary,
    marginLeft: 4,
  },
  emailFieldsContainer: {
    gap: 12,
  },
  emailFieldRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  emailInputContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    position: "relative",
  },
  emailIcon: {
    position: "absolute",
    left: 12,
    zIndex: 1,
  },
  emailInput: {
    flex: 1,
    backgroundColor: lightThemeColors.card,
    borderWidth: 1,
    borderColor: lightThemeColors.border,
    borderRadius: 8,
    padding: 12,
    paddingLeft: 40,
    fontSize: 16,
    color: lightThemeColors.foreground,
  },
  contactButton: {
    position: "absolute",
    right: 12,
    padding: 4,
  },
  removeButton: {
    padding: 8,
  },
  submitButton: {
    backgroundColor: lightThemeColors.primary,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 8,
  },
  submitButtonText: {
    color: lightThemeColors.primaryForeground,
    fontSize: 16,
    fontWeight: "600",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  modalBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: lightThemeColors.card,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
    maxHeight: "80%",
  },
  modalHandle: {
    width: 48,
    height: 4,
    backgroundColor: lightThemeColors.border,
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 16,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: lightThemeColors.foreground,
    marginLeft: 8,
  },
  contactsList: {
    maxHeight: 400,
  },
  contactItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 8,
  },
  contactAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: lightThemeColors.muted,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  avatarText: {
    fontSize: 20,
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 16,
    fontWeight: "500",
    color: lightThemeColors.foreground,
    marginBottom: 2,
  },
  contactEmail: {
    fontSize: 14,
    color: lightThemeColors.mutedForeground,
  },
  cancelButton: {
    backgroundColor: lightThemeColors.muted,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 16,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "500",
    color: lightThemeColors.foreground,
  },
  inputError: {
    borderColor: "red",
  },
  errorText: {
    color: "red",
    marginTop: 4,
    fontSize: 12,
  },
});

export default CreateGroup;
