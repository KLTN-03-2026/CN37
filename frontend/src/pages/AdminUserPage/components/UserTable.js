import React, { useState } from "react";
import classNames from "classnames/bind";
import styles from "./UserTable.module.scss";
import { FaEye, FaLock, FaLockOpen } from "react-icons/fa";
import { AiFillEdit } from "react-icons/ai";
import { IoIosMore } from "react-icons/io";
import { MdDelete } from "react-icons/md";
import { BiDetail } from "react-icons/bi";

const cx = classNames.bind(styles);

const UserTable = ({ users, loading, onView, onToggleOff, onToggleOn, onRefresh }) => {
  const handleToggleOn = (id) => {
    onToggleOn(id);
  };
  const handleToggleOff = (id) => {
    onToggleOff(id);
  };
  if (loading) return <p>Đang tải...</p>;

  return (
    <div className={cx("tableWrapper")}>
      <table className={cx("table")}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Email</th>
            <th>Tên</th>
            <th>SĐT</th>
            <th>Trạng thái</th>
            <th>Xác minh</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td>{u.id}</td>
              <td>{u.email}</td>
              <td>{u.fullName}</td>
              <td>{u.phone ? u.phone : "//"}</td>
              <td>
                <span
                  className={cx("status", {
                    active: u.isActive === true,
                    lock: u.isActive === false,
                  })}
                >
                  {u.isActive ? "Hoạt động" : "Bị khóa"}
                </span>
              </td>

              <td>
                <span
                  className={cx("verify", {
                    verified: u.emailVerified === true,
                    unverified: u.emailVerified === false,
                  })}
                >
                  {u.emailVerified ? "Đã xác minh" : "Chưa xác minh"}
                </span>
              </td>
              <td>
                <div className={cx("actions")}>
                  <button
                    title="xem chi tiết"
                    className={cx("actionBtn", "view")}
                    onClick={() => onView(u.id)}
                  >
                    <BiDetail />
                  </button>

                  <button
                    title={u.isActive ? "Khóa tài khoản" : "Mở tài khoản"}
                    className={cx("actionBtn", "edit")}
                    onClick={() => {
                      u.isActive ? handleToggleOff(u.id) : handleToggleOn(u.id);
                    }}
                  >
                    {u.isActive ? <FaLock /> : <FaLockOpen />}
                  </button>

                  <button
                    title="xóa tài khoản"
                    className={cx("actionBtn", "more")}
                  >
                    <MdDelete/>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;
