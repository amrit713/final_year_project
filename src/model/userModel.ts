import mongoose, { Document, Schema } from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import crypto from "crypto";

export interface IUser {
    firstName: string;
    email: string;
    password: string;
    passwordConfirm?: string;
    passwordChangeAt?: Date | number;
    phone: number | undefined;
    address: any;
    role: string;
    profilePic?: string;
    createdAt: Date;
    passwordResetToken?: string;
    passwordResetExpires?: Date;

    correctPassword(candidatePassword: string, userPassword: string): boolean;
    changedPasswordAfter(JWTTimestamp: number | undefined): boolean;
    createPasswordResetToken(): string;
}

export interface IModelUser extends IUser, Document {}

const userSchema: Schema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, "User should have First Name"],
    },

    lastName: {
        type: String,
        required: [true, "User should have Last Name"],
    },

    email: {
        type: String,
        required: [true, "User should have Email"],
        unique: [true, "email already used"],
        validate: [validator.isEmail, "Please Enter Valid Email"],
    },

    password: {
        type: String,
        required: [true, "User Should Enter The Password"],

        minlength: 8,

        select: false,
    },

    passwordConfirm: {
        type: String,
        required: [true, "Please Confirm The Password"],
        validate: {
            validator: function (this: IModelUser, el: string) {
                return el === this.password;
            },
            message: "Password Did Not Match ",
        },
    },

    passwordChangeAt: Date,

    phone: Number,

    role: {
        type: String,
        enum: ["admin", "user"],
        default: "user",
    },

    profilePic: String,

    createdAt: {
        type: Date,
        default: Date.now(),
    },

    passwordResetToken: String,

    passwordResetExpires: Date,

    active: {
        type: Boolean,
        default: true,
        select: false,
    },

    address: [
        {
            street_address: String,
            state: String,
            city: String,
        },
    ],
});

userSchema.pre("save", async function (this: IModelUser, next) {
    if (!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 12);

    this.passwordConfirm = undefined;

    next();
});

userSchema.methods.correctPassword = async function (
    candidatePassword: string,
    userPassword: string
) {
    const isValid = await bcrypt.compare(candidatePassword, userPassword);
    return isValid;
};

//checkThePassword Change or not
userSchema.methods.changedPasswordAfter = function (JWTTimestamp: number) {
    if (this.passwordChangeAt) {
        const changedTimestamp = parseInt(
            `${this.passwordChangeAt.getTime() / 1000} `,
            10
        );
        console.log(changedTimestamp, JWTTimestamp);
        console.log("🚀 ~ file: userModel.ts:131 ~ log");
        return JWTTimestamp < changedTimestamp;
    }
    return false;
};

//create resetChangeAt
userSchema.pre("save", function (next) {
    if (!this.isModified("password") || this.isNew) return next(); // didnt modified password

    this.passwordChangeAt = Date.now() - 1000;
    next();
});

// generate password Reset token function
userSchema.methods.createPasswordResetToken = function () {
    const resetToken = crypto.randomBytes(32).toString("hex");

    this.passwordResetToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");

    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

    return resetToken;
};

// //query middleware
// userSchema.pre(/^find/, function (next) {
//     //this points to current query
//     this.find({ active: { $ne: false } });

//     next();
// });

const User = mongoose.model<IModelUser>("User", userSchema);

export default User;
