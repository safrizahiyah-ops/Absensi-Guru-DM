import React, { useState, useMemo } from 'react';
import { useAttendance } from '../context/AttendanceContext';
import { Teacher } from '../types';
import {
  GraduationCap,
  Plus,
  Search,
  Edit2,
  Trash2,
  X,
  Check,
  UserCheck,
} from 'lucide-react';

export const MasterTeachersView: React.FC = () => {
  const { teachers, subjects, addTeacher, updateTeacher, deleteTeacher } = useAttendance();

  const [search, setSearch] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);

  // Form states
  const [name, setName] = useState<string>('');
  const [nip, setNip] = useState<string>('');
  const [gender, setGender] = useState<'L' | 'P'>('L');
  const [primarySubject, setPrimarySubject] = useState<string>('');
  const [phone, setPhone] = useState<string>('');

  const filteredTeachers = useMemo(() => {
    if (!search.trim()) return teachers;
    const q = search.toLowerCase();
    return teachers.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        (t.primarySubject && t.primarySubject.toLowerCase().includes(q)) ||
        (t.nip && t.nip.includes(q))
    );
  }, [teachers, search]);

  const handleOpenAdd = () => {
    setEditingTeacher(null);
    setName('');
    setNip('');
    setGender('L');
    setPrimarySubject(subjects[0]?.name || '');
    setPhone('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (t: Teacher) => {
    setEditingTeacher(t);
    setName(t.name);
    setNip(t.nip || '');
    setGender(t.gender);
    setPrimarySubject(t.primarySubject);
    setPhone(t.phone || '');
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingTeacher) {
      updateTeacher(editingTeacher.id, {
        name: name.trim(),
        nip: nip.trim() || undefined,
        gender,
        primarySubject: primarySubject.trim(),
        phone: phone.trim() || undefined,
      });
    } else {
      addTeacher({
        name: name.trim(),
        nip: nip.trim() || undefined,
        gender,
        primarySubject: primarySubject.trim(),
        phone: phone.trim() || undefined,
        isActive: true,
      });
    }

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-emerald-700" />
            Data Guru & Tenaga Pendidik
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Daftar Ustadz & Ustadzah pengampu mata pelajaran di MA/MTs Darul Mahfudz
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-md transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Guru Baru</span>
        </button>
      </div>

      {/* Search and stats bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari nama guru, mata pelajaran, NIP..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50/50 focus:ring-2 focus:ring-emerald-500"
          />
        </div>
        <span className="text-xs font-semibold text-slate-500">
          Total {teachers.length} Dewan Guru Terdaftar
        </span>
      </div>

      {/* Teachers Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-700 text-xs uppercase font-bold border-b border-slate-200">
              <tr>
                <th className="py-3 px-3 text-center w-12">No</th>
                <th className="py-3 px-3">Nama Lengkap & Gelar</th>
                <th className="py-3 px-3">NIP / NUPTK</th>
                <th className="py-3 px-3 text-center">L/P</th>
                <th className="py-3 px-3">Mata Pelajaran Utama</th>
                <th className="py-3 px-3">Kontak / No. HP</th>
                <th className="py-3 px-3 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
              {filteredTeachers.map((t, idx) => (
                <tr key={t.id} className="hover:bg-slate-50/80">
                  <td className="py-3 px-3 text-center text-slate-500">{idx + 1}</td>
                  <td className="py-3 px-3 font-bold text-slate-900">{t.name}</td>
                  <td className="py-3 px-3 font-mono text-xs text-slate-500">{t.nip || '-'}</td>
                  <td className="py-3 px-3 text-center">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${
                        t.gender === 'L'
                          ? 'bg-blue-50 text-blue-700'
                          : 'bg-pink-50 text-pink-700'
                      }`}
                    >
                      {t.gender === 'L' ? 'Ikhwan' : 'Akhwat'}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-700 font-medium">
                    {t.primarySubject || '-'}
                  </td>
                  <td className="py-3 px-3 font-mono text-xs text-slate-500">{t.phone || '-'}</td>
                  <td className="py-3 px-3 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(t)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-emerald-700 hover:bg-emerald-50"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (
                            confirm(`Hapus guru ${t.name}? Tindakan ini tidak dapat dibatalkan.`)
                          ) {
                            deleteTeacher(t.id);
                          }
                        }}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-rose-700 hover:bg-rose-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Teacher Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="px-5 py-4 bg-emerald-800 text-white flex items-center justify-between">
              <h3 className="font-bold text-base">
                {editingTeacher ? 'Edit Data Guru' : 'Tambah Guru Baru'}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-emerald-200 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Nama Lengkap & Gelar *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Ust. Ahmad Fauzi, S.Pd.I"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    NIP / NUPTK
                  </label>
                  <input
                    type="text"
                    placeholder="19800101..."
                    value={nip}
                    onChange={(e) => setNip(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Jenis Kelamin
                  </label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as 'L' | 'P')}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 text-sm bg-white"
                  >
                    <option value="L">Laki-laki (Ikhwan)</option>
                    <option value="P">Perempuan (Akhwat)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Mata Pelajaran Utama
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Al-Qur'an Hadits, Fikih..."
                  value={primarySubject}
                  onChange={(e) => setPrimarySubject(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Nomor HP / WhatsApp
                </label>
                <input
                  type="text"
                  placeholder="081234..."
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 text-sm"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 font-semibold text-xs"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-md"
                >
                  Simpan Data
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
