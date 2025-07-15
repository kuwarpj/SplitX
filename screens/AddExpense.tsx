import Routes from "@/constants/ApiRoutes";
import { useApp } from "@/context/AppContext";
import { fetchAPI } from "@/utils/fetchAPI";
import { AntDesign, Feather } from "@expo/vector-icons";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  FlatList,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { lightThemeColors } from "../constants/Colors";

interface GroupMember {
  id: string;
  name: string;
  avatar: string;
  isSelected: boolean;
  splitAmount?: number;
  splitPercentage?: number;
}

type SplitType = "equal" | "exact" | "percentage";

const AddExpense = ({ route, navigation }) => {
  const { groupId } = route.params;
  const { userGroup, user } = useApp();
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [paidBy, setPaidBy] = useState(String);
  const [splitType, setSplitType] = useState<SplitType>("equal");
  const [notes, setNotes] = useState("");
  const [showPaidByModal, setShowPaidByModal] = useState(false);
  const [showSplitModal, setShowSplitModal] = useState(false);
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState(null);
  const [groupMembers, setGroupMembers] = useState<GroupMember[]>([]);
  const [errors, setErrors] = useState({
    description: "",
    amount: "",
    splitMembers: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  useEffect(() => {
    if (userGroup?.length) {
      if (groupId) {
        setSelectedGroupId(groupId);
      } else {
        setSelectedGroupId(userGroup[0]._id);
      }
    }
  }, [groupId, userGroup]);

  const selectedGroup = useMemo(() => {
    return userGroup?.find((group) => group._id === selectedGroupId);
  }, [userGroup, selectedGroupId]);

  useEffect(() => {
    if (selectedGroup?.members?.length && user?.id) {
      const foundMember = selectedGroup.members.find(
        (member: any) => member._id === user.id
      );
      const initializedMembers = selectedGroup.members.map((member: any) => ({
        id: member._id,
        name: member.username,
        avatar: member.username?.charAt(0),
        isSelected: true, // default: everyone selected
        splitAmount: 0,
        splitPercentage: 0,
      }));
      setGroupMembers(initializedMembers);
      if (foundMember) {
        setPaidBy(user.id);
      } else {
        setPaidBy(selectedGroup.members[0]._id);
      }
    }
  }, [selectedGroup, user]);

  const selectedMembers = groupMembers.filter((member) => member.isSelected);
  const totalAmount = parseFloat(amount) || 0;

  const toggleMemberSelection = (memberId: string) => {
    setGroupMembers((members) =>
      members.map((member) =>
        member.id === memberId
          ? { ...member, isSelected: !member.isSelected }
          : member
      )
    );
  };

  const updateMemberSplit = (memberId: string, value: number) => {
    setGroupMembers((members) =>
      members.map((member) =>
        member.id === memberId ? { ...member, splitAmount: value } : member
      )
    );
  };

  const calculateEqualSplit = () => {
    if (selectedMembers.length === 0 || totalAmount === 0) return;

    const splitAmount = totalAmount / selectedMembers.length;
    setGroupMembers((members) =>
      members.map((member) =>
        member.isSelected ? { ...member, splitAmount: splitAmount } : member
      )
    );
  };

  const getTotalSplitAmount = () => {
    return selectedMembers.reduce(
      (sum, member) => sum + (member.splitAmount || 0),
      0
    );
  };

  const getRemainingAmount = () => {
    return totalAmount - getTotalSplitAmount();
  };

  // Auto-calculate equal split when amount or members change
  React.useEffect(() => {
    if (splitType === "equal") {
      calculateEqualSplit();
    }
  }, [amount, selectedMembers.length, splitType]);

  const handleSubmit = useCallback(async () => {
    let validationErrors = {
      description: "",
      amount: "",
      splitMembers: "",
    };

    if (!description.trim()) {
      validationErrors.description = "Description is required.";
    }

    if (!amount || parseFloat(amount) <= 0) {
      validationErrors.amount = "Amount must be greater than 0.";
    }

    if (selectedMembers.length === 0) {
      validationErrors.splitMembers =
        "At least one participant must be selected.";
    }

    setErrors(validationErrors);

    if (
      validationErrors.description ||
      validationErrors.amount ||
      validationErrors.splitMembers
    ) {
      return;
    }

    setIsSubmitting(true);
    const participantIds = selectedMembers
      .filter((m) => m.isSelected)
      .map((m) => m.id);

    const payload = {
      groupId: selectedGroupId,
      description: description,
      amount: totalAmount,
      paidBy: paidBy,
      participantIds,
    };

    try {
      const data = await fetchAPI(Routes.ADD_EXPENSE, "POST", payload);
      if (data?.success === true) {
        Toast.show({
          type: "success",
          text1: "Expense added successfully!",
        });
        navigation.goBack();
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsSubmitting(false);
    }
  }, [
    description,
    amount,
    selectedMembers,
    paidBy,
    selectedGroupId,
    totalAmount,
  ]);

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: lightThemeColors.background }}
      edges={["top", "left", "right"]}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.backButton}
            >
              <Feather name="arrow-left" size={24} color="gray" />
            </TouchableOpacity>
            <View style={styles.headerTextContainer}>
              <Text style={styles.headerTitle}>Add Expense</Text>
              <Text style={styles.headerSubtitle}>
                Split with group members
              </Text>
            </View>
            <TouchableOpacity
              onPress={handleSubmit}
              style={[
                styles.saveButton,
                (!description || !amount || selectedMembers.length === 0) &&
                  styles.saveButtonDisabled,
              ]}
            >
              <Text style={styles.saveButtonText}>
                {isSubmitting ? (
                  <Text style={styles.saveButtonText}>Saving</Text>
                ) : (
                  <Text style={styles.saveButtonText}>Save</Text>
                )}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView style={styles.content}>
          <View style={styles.card}>
            <View style={styles.groupSelectionRow}>
              <Text style={styles.groupSelectionLabel}>For group:</Text>
              <TouchableOpacity
                onPress={() => setShowGroupModal(true)}
                style={styles.groupSelectionButton}
              >
                <Text style={styles.groupIcon}>
                  {/* {availableGroups.find((g) => g.id === selectedGroupId)?.icon} */}
                  <Image
                    source={{ uri: selectedGroup?.iconUrl }}
                    style={{
                      width: 25,
                      height: 25,
                      borderRadius: "50%",
                      marginInlineEnd: 10,
                    }}
                  />
                </Text>
                <Text style={styles.groupName}>
                  {selectedGroup?.name || "Select Group"}
                </Text>
                <View style={styles.groupChevron}>
                  <View style={styles.chevronDot} />
                </View>
              </TouchableOpacity>
            </View>
          </View>

          {/* Group Selection Modal */}
          <Modal
            visible={showGroupModal}
            animationType="slide"
            transparent={true}
            onRequestClose={() => setShowGroupModal(false)}
          >
            <View style={styles.modalOverlay}>
              <TouchableOpacity
                style={styles.modalBackground}
                activeOpacity={0.6}
                onPress={() => setShowGroupModal(false)}
              />

              <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Select Group</Text>
                  <TouchableOpacity
                    onPress={() => setShowGroupModal(false)}
                    style={styles.modalCloseButton}
                    activeOpacity={0.6}
                  >
                    <Feather
                      name="x"
                      size={20}
                      color={lightThemeColors.foreground}
                    />
                  </TouchableOpacity>
                </View>

                {/* Scrollable Group List */}
                <ScrollView style={{ maxHeight: 400 }}>
                  <View style={styles.modalBody}>
                    {userGroup?.map((group) => (
                      <TouchableOpacity
                        key={group._id}
                        onPress={() => {
                          setSelectedGroupId(group._id);
                          setShowGroupModal(false);
                        }}
                        activeOpacity={0.6}
                        style={[
                          styles.groupOption,
                          selectedGroupId === group._id &&
                            styles.groupOptionSelected,
                        ]}
                      >
                        <Image
                          source={{ uri: group?.iconUrl }}
                          style={{
                            width: 30,
                            height: 30,
                            borderRadius: "50%",
                            marginInlineEnd: 10,
                          }}
                        />
                        <View style={styles.groupOptionText}>
                          <Text style={styles.groupOptionName}>
                            {group?.name}
                          </Text>
                          <Text style={styles.groupOptionMembers}>
                            {group.members.length} members
                          </Text>
                        </View>
                        {selectedGroupId === group._id && (
                          <Feather
                            name="check"
                            size={20}
                            color={lightThemeColors.primary}
                          />
                        )}
                      </TouchableOpacity>
                    ))}
                  </View>
                </ScrollView>
              </View>
            </View>
          </Modal>

          {/* Basic Info */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Expense Details</Text>

            {/* Description */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Description</Text>
              <TextInput
                placeholder="What was this expense for?"
                value={description}
                onChangeText={(text) => {
                  setDescription(text);
                  if (errors.description)
                    setErrors((prev) => ({ ...prev, description: "" }));
                }}
                style={styles.input}
                placeholderTextColor={lightThemeColors.mutedForeground}
              />
              {errors.description && (
                <Text style={{ color: "red", marginTop: 4, fontSize: 12 }}>
                  {errors.description}
                </Text>
              )}
            </View>

            {/* Amount */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Amount</Text>
              <View style={styles.amountInputContainer}>
                <TextInput
                  keyboardType="decimal-pad"
                  placeholder="0.00"
                  value={amount}
                  onChangeText={(text) => {
                    setAmount(text);
                    if (errors.amount)
                      setErrors((prev) => ({ ...prev, amount: "" }));
                  }}
                  style={[styles.input, styles.amountInput]}
                  placeholderTextColor={lightThemeColors.mutedForeground}
                />

                <Feather
                  name="dollar-sign"
                  size={20}
                  color={lightThemeColors.mutedForeground}
                  style={styles.amountIcon}
                />
              </View>
              {errors.amount ? (
                <Text style={{ color: "red", marginTop: 4, fontSize: 12 }}>
                  {errors.amount}
                </Text>
              ) : null}
            </View>
          </View>

          <View style={styles.card}>
            <View style={styles.splitHeader}>
              <Text style={styles.cardTitle}>Split Details</Text>
              <View style={styles.splitPeopleCount}>
                <Feather
                  name="users"
                  size={20}
                  color={lightThemeColors.foreground}
                />
                <Text style={styles.splitPeopleText}>
                  {groupMembers.filter((member) => member.isSelected).length}{" "}
                  people
                </Text>
              </View>
            </View>

            <View style={styles.splitOptions}>
              {/* Paid By Summary */}
              <TouchableOpacity
                onPress={() => setShowPaidByModal(true)}
                style={styles.splitOptionButton}
                activeOpacity={0.6}
              >
                <View style={styles.splitOptionText}>
                  <Text style={styles.splitOptionLabel}>Paid by</Text>
                  {/* Display the name of user who is paying by default it wil be login user name */}
                  <Text style={styles.splitOptionValue}>
                    {selectedGroup?.members?.find((m: any) => m._id === paidBy)
                      ?._id === user?.id
                      ? "You"
                      : selectedGroup?.members?.find(
                          (m: any) => m._id === paidBy
                        )?.username || "Unknown"}
                  </Text>
                </View>
                <View style={styles.splitOptionRight}>
                  <View style={styles.avatarSmall}>
                    <Text style={styles.avatarTextSmall}>
                      {selectedGroup?.members
                        ?.find((m: any) => m._id === paidBy)
                        ?.username.charAt(0)}
                    </Text>
                  </View>
                  <View style={styles.optionChevron}>
                    <View style={styles.chevronDot} />
                  </View>
                </View>
              </TouchableOpacity>

              {/* Split Type Summary */}
              <TouchableOpacity
                onPress={() => setShowSplitModal(true)}
                style={styles.splitOptionButton}
                activeOpacity={0.6}
              >
                <View style={styles.splitOptionText}>
                  <Text style={styles.splitOptionLabel}>and split</Text>
                  <Text style={styles.splitOptionValue}>
                    {splitType === "equal"
                      ? "equally"
                      : splitType === "exact"
                      ? "by exact amounts"
                      : "by percentages"}
                  </Text>
                </View>
                <View style={styles.splitOptionRight}>
                  <AntDesign
                    name="calendar"
                    size={20}
                    color={lightThemeColors.primary}
                  />
                  <View style={styles.optionChevron}>
                    <View style={styles.chevronDot} />
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          </View>

          {/* Notes */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Notes (Optional)</Text>
            <TextInput
              placeholder="Add any additional notes about this expense..."
              value={notes}
              onChangeText={setNotes}
              style={styles.notesInput}
              placeholderTextColor={lightThemeColors.mutedForeground}
              multiline
            />
          </View>

          {/* Bottom Spacing */}
          <View style={styles.bottomSpacing} />
        </ScrollView>

        {/* Paid By Modal */}
        <Modal
          visible={showPaidByModal}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setShowPaidByModal(false)}
        >
          <View style={styles.modalOverlay}>
            <TouchableOpacity
              style={styles.modalBackground}
              activeOpacity={0.6}
              onPress={() => setShowPaidByModal(false)}
            />
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Who paid?</Text>
                <TouchableOpacity
                  onPress={() => setShowPaidByModal(false)}
                  style={styles.modalCloseButton}
                  activeOpacity={0.6}
                >
                  <Feather
                    name="x"
                    size={20}
                    color={lightThemeColors.foreground}
                  />
                </TouchableOpacity>
              </View>

              <View style={styles.modalBody}>
                {selectedGroup?.members?.map((member: any) => (
                  <TouchableOpacity
                    key={member._id}
                    onPress={() => {
                      setPaidBy(member._id);
                      setShowPaidByModal(false);
                    }}
                    activeOpacity={0.6}
                    style={[
                      styles.paidByOption,
                      paidBy === member._id && styles.paidByOptionSelected,
                    ]}
                  >
                    <View style={styles.avatar}>
                      <Text style={styles.avatarText}>
                        {member?.username?.charAt(0)}
                      </Text>
                    </View>
                    <Text style={styles.paidByName}>{member.username}</Text>
                    {paidBy === member._id && (
                      <Feather
                        name="check"
                        size={20}
                        color={lightThemeColors.primary}
                      />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        </Modal>

        {/* Split Modal */}
        <Modal
          visible={showSplitModal}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setShowSplitModal(false)}
        >
          <View style={styles.modalOverlay}>
            <TouchableOpacity
              style={styles.modalBackground}
              activeOpacity={1}
              onPress={() => setShowSplitModal(false)}
              activeOpacity={0.6}
            />
            <View style={styles.modalContentLarge}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Split options</Text>
                <TouchableOpacity
                  onPress={() => setShowSplitModal(false)}
                  style={styles.modalCloseButton}
                  activeOpacity={0.6}
                >
                  <Feather
                    name="x"
                    size={20}
                    color={lightThemeColors.foreground}
                  />
                </TouchableOpacity>
              </View>

              {/* Split Type Selector */}
              <View style={styles.splitTypeSelector}>
                <TouchableOpacity
                  onPress={() => setSplitType("equal")}
                  style={[
                    styles.splitTypeButton,
                    splitType === "equal" && styles.splitTypeButtonActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.splitTypeButtonText,
                      splitType === "equal" && styles.splitTypeButtonTextActive,
                    ]}
                  >
                    Equal
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setSplitType("exact")}
                  style={[
                    styles.splitTypeButton,
                    splitType === "exact" && styles.splitTypeButtonActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.splitTypeButtonText,
                      splitType === "exact" && styles.splitTypeButtonTextActive,
                    ]}
                  >
                    Exact
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setSplitType("percentage")}
                  style={[
                    styles.splitTypeButton,
                    splitType === "percentage" && styles.splitTypeButtonActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.splitTypeButtonText,
                      splitType === "percentage" &&
                        styles.splitTypeButtonTextActive,
                    ]}
                  >
                    %
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Members List */}
              <FlatList
                data={groupMembers}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() => toggleMemberSelection(item.id)}
                    style={[
                      styles.memberItem,
                      item.isSelected && styles.memberItemSelected,
                    ]}
                    activeOpacity={0.6}
                  >
                    {/* Checkbox */}
                    <View
                      style={[
                        styles.memberCheckbox,
                        item.isSelected && styles.memberCheckboxSelected,
                      ]}
                    >
                      {item.isSelected && (
                        <Feather
                          name="check"
                          size={20}
                          color={lightThemeColors.primary}
                        />
                      )}
                    </View>

                    {/* Avatar */}
                    <View style={styles.avatarSmall}>
                      <Text style={styles.avatarTextSmall}>{item.avatar}</Text>
                    </View>

                    {/* Name */}
                    <Text style={styles.memberName}>{item.name}</Text>

                    {/* Split Input */}
                    {item.isSelected && (
                      <View style={styles.memberSplitInputContainer}>
                        {splitType === "equal" ? (
                          <Text style={styles.memberSplitAmount}>
                            ₹{(item.splitAmount || 0).toFixed(2)}
                          </Text>
                        ) : splitType === "exact" ? (
                          <View style={styles.exactAmountInput}>
                            <Text style={styles.currencySymbol}>₹</Text>
                            <TextInput
                              keyboardType="decimal-pad"
                              value={item.splitAmount?.toString() || ""}
                              onChangeText={(text) =>
                                updateMemberSplit(
                                  item.id,
                                  parseFloat(text) || 0
                                )
                              }
                              style={styles.splitInput}
                              placeholder="0.00"
                            />
                          </View>
                        ) : (
                          <View style={styles.percentageInput}>
                            <TextInput
                              keyboardType="decimal-pad"
                              value={item.splitPercentage?.toString() || ""}
                              onChangeText={(text) =>
                                setGroupMembers((members) =>
                                  members.map((m) =>
                                    m.id === item.id
                                      ? {
                                          ...m,
                                          splitPercentage:
                                            parseFloat(text) || 0,
                                        }
                                      : m
                                  )
                                )
                              }
                              style={styles.splitInput}
                              placeholder="0"
                            />
                            <Text style={styles.percentageSymbol}>%</Text>
                          </View>
                        )}
                      </View>
                    )}
                  </TouchableOpacity>
                )}
              />

              {/* Split Summary */}
              {splitType === "exact" && totalAmount > 0 && (
                <View style={styles.splitSummary}>
                  <View style={styles.splitSummaryRow}>
                    <Text style={styles.splitSummaryLabel}>Total expense:</Text>
                    <Text style={styles.splitSummaryValue}>
                      ₹{totalAmount.toFixed(2)}
                    </Text>
                  </View>
                  <View style={styles.splitSummaryRow}>
                    <Text style={styles.splitSummaryLabel}>Split amount:</Text>
                    <Text style={styles.splitSummaryValue}>
                      {getTotalSplitAmount().toFixed(2)}
                    </Text>
                  </View>
                  <View style={styles.splitSummaryRow}>
                    <Text
                      style={[
                        styles.splitSummaryLabel,
                        getRemainingAmount() === 0
                          ? styles.splitSummaryPositive
                          : styles.splitSummaryNegative,
                      ]}
                    >
                      Remaining:
                    </Text>
                    <Text
                      style={[
                        styles.splitSummaryValue,
                        getRemainingAmount() === 0
                          ? styles.splitSummaryPositive
                          : styles.splitSummaryNegative,
                      ]}
                    >
                      ₹{getRemainingAmount().toFixed(2)}
                    </Text>
                  </View>
                </View>
              )}

              <TouchableOpacity
                onPress={() => setShowSplitModal(false)}
                style={styles.doneButton}
              >
                <Text style={styles.doneButtonText}>Done</Text>
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
    
    backgroundColor: lightThemeColors.background,
  },
  header: {
    padding: 16,
    paddingTop: 0,
    borderBottomWidth: 1,
    borderBottomColor: lightThemeColors.border,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    maxWidth: 500,
    width: "100%",
    alignSelf: "center",
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTextContainer: {
    alignItems: "center",
    // marginLeft: 12,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: lightThemeColors.foreground,
  },
  headerSubtitle: {
    fontSize: 12,
    color: lightThemeColors.mutedForeground,
  },
  saveButton: {
    // backgroundColor: lightThemeColors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
  },
  saveButtonDisabled: {
    opacity: 1,
  },
  saveButtonText: {
    color: lightThemeColors.primary,
    fontWeight: "700",
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    marginTop: 16,
    maxWidth: 500,
    width: "100%",
    alignSelf: "center",
  },
  card: {
    backgroundColor: lightThemeColors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: lightThemeColors.border,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: lightThemeColors.foreground,
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
    width: "100%",
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
  amountInputContainer: {
    flexDirection: "row",

    alignItems: "center",
  },
  amountIcon: {
    position: "absolute",
    left: 12,
    zIndex: 1,
  },
  amountInput: {
    flex: 1,
    paddingLeft: 40,
    fontWeight: "500",
  },
  categoryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  categoryButton: {
    width: "48%",
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: lightThemeColors.border,
    marginBottom: 8,
  },
  categoryButtonSelected: {
    borderColor: lightThemeColors.primary,
    backgroundColor: lightThemeColors.primary + "10", // Add alpha for opacity
  },
  categoryIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: "500",
    color: lightThemeColors.foreground,
  },
  splitHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  splitPeopleCount: {
    flexDirection: "row",
    alignItems: "center",
  },
  splitPeopleText: {
    fontSize: 14,
    color: lightThemeColors.mutedForeground,
    marginLeft: 4,
  },
  splitOptions: {
    gap: 12,
  },
  splitOptionButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: lightThemeColors.border,
  },
  splitOptionText: {
    flexDirection: "row",
    alignItems: "center",
  },
  splitOptionLabel: {
    fontSize: 14,
    color: lightThemeColors.mutedForeground,
    marginRight: 4,
  },
  splitOptionValue: {
    fontSize: 14,
    fontWeight: "500",
    color: lightThemeColors.foreground,
  },
  splitOptionRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatarSmall: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: lightThemeColors.secondary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  avatarTextSmall: {
    fontSize: 12,
    fontWeight: "500",
    color: lightThemeColors.secondaryForeground,
  },
  optionChevron: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: lightThemeColors.border,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
  chevronDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: lightThemeColors.primary,
  },
  notesInput: {
    backgroundColor: lightThemeColors.card,
    borderWidth: 1,
    borderColor: lightThemeColors.border,
    borderRadius: 12,
    padding: 12,
    fontSize: 14,
    color: lightThemeColors.foreground,
    height: 80,
    textAlignVertical: "top",
  },
  bottomSpacing: {
    height: 24,
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
    padding: 24,
    maxHeight: "80%",
  },
  modalContentLarge: {
    backgroundColor: lightThemeColors.card,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    maxHeight: "80%",
    height: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: lightThemeColors.foreground,
  },
  modalCloseButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: lightThemeColors.muted,
    justifyContent: "center",
    alignItems: "center",
  },
  modalBody: {
    gap: 8,
  },
  paidByOption: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: lightThemeColors.border,
  },
  paidByOptionSelected: {
    borderColor: lightThemeColors.primary,
    backgroundColor: lightThemeColors.muted,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: lightThemeColors.secondary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  avatarText: {
    fontSize: 16,
    fontWeight: "500",
    color: lightThemeColors.secondaryForeground,
  },
  paidByName: {
    flex: 1,
    fontSize: 16,
    fontWeight: "500",
    color: lightThemeColors.foreground,
  },
  checkIcon: {
    marginLeft: "auto",
  },
  splitTypeSelector: {
    flexDirection: "row",
    backgroundColor: lightThemeColors.muted,
    borderRadius: 12,
    padding: 4,
    marginBottom: 16,
  },
  splitTypeButton: {
    flex: 1,
    padding: 8,
    borderRadius: 8,
    alignItems: "center",
  },
  splitTypeButtonActive: {
    backgroundColor: lightThemeColors.card,
  },
  splitTypeButtonText: {
    fontSize: 14,
    fontWeight: "500",
    color: lightThemeColors.mutedForeground,
  },
  splitTypeButtonTextActive: {
    color: lightThemeColors.primary,
  },
  memberItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: lightThemeColors.border,
    marginBottom: 8,
  },
  memberItemSelected: {
    borderColor: lightThemeColors.primary,
  },
  memberCheckbox: {
    width: 18,
    height: 18,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: lightThemeColors.border,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  memberCheckboxSelected: {
    borderColor: lightThemeColors.primary,
    backgroundColor: lightThemeColors.primary,
  },
  memberName: {
    flex: 1,
    fontSize: 16,
    fontWeight: "500",
    color: lightThemeColors.foreground,
    marginLeft: 12,
  },
  memberSplitInputContainer: {
    marginLeft: "auto",
  },
  memberSplitAmount: {
    fontSize: 14,
    fontWeight: "500",
    color: lightThemeColors.foreground,
  },
  exactAmountInput: {
    flexDirection: "row",
    alignItems: "center",
  },
  currencySymbol: {
    fontSize: 14,
    color: lightThemeColors.mutedForeground,
    marginRight: 4,
  },
  percentageInput: {
    flexDirection: "row",
    alignItems: "center",
  },
  percentageSymbol: {
    fontSize: 14,
    color: lightThemeColors.mutedForeground,
    marginLeft: 4,
  },
  splitInput: {
    width: 80,
    borderWidth: 1,
    borderColor: lightThemeColors.border,
    borderRadius: 8,
    padding: 8,
    fontSize: 14,
    color: lightThemeColors.foreground,
    textAlign: "center",
  },
  splitSummary: {
    backgroundColor: lightThemeColors.muted,
    borderRadius: 12,
    padding: 12,
    marginTop: 16,
  },
  splitSummaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  splitSummaryLabel: {
    fontSize: 14,
    color: lightThemeColors.mutedForeground,
  },
  splitSummaryValue: {
    fontSize: 14,
    fontWeight: "500",
    color: lightThemeColors.foreground,
  },
  splitSummaryPositive: {
    color: "#10B981", // green-500 equivalent
  },
  splitSummaryNegative: {
    color: "#EF4444", // red-500 equivalent
  },
  doneButton: {
    backgroundColor: lightThemeColors.primary,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 16,
  },
  doneButtonText: {
    color: lightThemeColors.primaryForeground,
    fontSize: 16,
    fontWeight: "500",
  },

  groupSelectionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  groupSelectionLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: lightThemeColors.foreground,
  },
  groupSelectionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: lightThemeColors.border,
  },
  groupIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  groupName: {
    fontSize: 16,
    fontWeight: "500",
    color: lightThemeColors.foreground,
  },
  groupChevron: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: lightThemeColors.border,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
  groupOption: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: lightThemeColors.border,
    marginBottom: 8,
  },
  groupOptionSelected: {
    borderColor: lightThemeColors.primary,
    backgroundColor: lightThemeColors.muted,
  },
  groupOptionIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  groupOptionText: {
    flex: 1,
  },
  groupOptionName: {
    fontSize: 16,
    fontWeight: "500",
    color: lightThemeColors.foreground,
  },
  groupOptionMembers: {
    fontSize: 14,
    color: lightThemeColors.mutedForeground,
  },
});

export default AddExpense;
